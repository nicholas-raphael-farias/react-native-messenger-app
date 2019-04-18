import {observable, computed, action} from 'mobx';

import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import NewPassword from '../screens/NewPassword';

const API_URL = 'https://374206ab.ngrok.io';

const socket = io(API_URL, {
  transports: ['websocket'],
  forceNew: true
});

const client = feathers();
client.configure(socketio(socket));

class MessengerStore {
  @observable phone;
  @observable password;
  @observable isLogged = false;
  @observable isActive = false;
  @observable onDuty = false;
  @observable messenger;
  @observable deliveries = [];
  @observable locationId;
  @observable watchID;
  @observable currentTimestamp = 0;
  @observable latitude;
  @observable longitude;
  @observable newPassword;
  @observable newPasswordRepeat;
  @observable selectedTask;

  @observable deliveriesService;
  @observable tasksService;
  @observable messengersService;
  @observable locationsService;

  constructor(){
    client.service('deliveries').on('patched', patchedDelivery => {
        client.service('deliveries_and_tasks').find({'query': {'deliveryId': patchedDelivery.id}}).then((deliveryWithTasks) => {
          this.deliveries.push(deliveryWithTasks[0]);
        });
    });

    client.service('deliveries').on('removed', removedDelivery => {
      const deliveryIndex = this.deliveries.findIndex(delivery => (delivery.id === removedDelivery.id));
      this.deliveries.splice(deliveryIndex,1);
    });
  }


  @action setLogOut() {
    this.isLogged = false;
  }


  @action setPhone(phone) {
    this.phone = phone;
  }

  @action setPassword(password) {
    this.password = password;
  }

  @action setMessenger(messenger) {
    this.messenger = messenger;
  }

  @action setDeliveries(deliveries) {
    this.deliveries = deliveries;
  }

  @action setNewPassword(password) {
    this.newPassword = password;
  }

  @action setNewPasswordRepeat(password) {
    this.newPasswordRepeat = password;
  }

  @action setSelectedTask(task) {
    this.selectedTask = task;
  }

  @action async updatePassword() {
    this.isLogged = false;
    
    await  client.service('messengers').patch(this.messenger.id, {'password': this.newPassword, 'is_active': true}).then((result) => {
    });
  }

  @action async updateLocation(locationn) {
    await this.locationsService.patch(this.messenger.locationId, {'latitude': locationn.coords.latitude, 'longitude': locationn.coords.longitude, 'messengerId': this.messenger.id}).then((result) => {
      this.currentTimestamp = locationn.timestamp;
      this.latitude = locationn.coords.latitude;
      this.longitude = locationn.coords.longitude;  
    });

    if (!this.messenger.on_duty) {
      await client.service('update_messenger_status').patch(this.messenger.id, {'on_duty': true}).then((result) => {
        this.onDuty = true;
      });
    }
  }
 
  @action errorGeolocating(error) {
    console.warn(error);
  }

  @action activateMessenger() {
    this.messengersService = client.service('messengers');
    this.locationsService = client.service('locations');

    this.watchID = navigator.geolocation.watchPosition((l) => this.updateLocation(l), (e) => this.errorGeolocating(e));
  }

  @action async deactivateMessenger() {
    this.messengersService = client.service('messengers');
    
    navigator.geolocation.clearWatch(this.watchID);
    navigator.geolocation.stopObserving();

    await client.service('update_messenger_status').patch(this.messenger.id, {'on_duty': false}).then((result) => {
      this.onDuty = false;
    });
  }

  @action changeDutyStatus(status){
    client.service('update_messenger_status').patch(18, {'on_duty': status}).then(() => {
      this.onDuty = status;
      console.warn(status);
    });
  }

  @action async authMessenger() {
    this.messengersService = client.service('messengers');
    this.deliveriesService = client.service('messenger_deliveries');

    await this.messengersService.find({'query': {'phone': this.phone, 'password': this.password}}).then((result) => {
      if (result.length > 0) {
        this.messenger = result[0];
        if (this.messenger.is_active) {
          this.isLogged = true;
          this.isActive = true;
          this.deliveriesService.find({'query': {'messengerId': this.messenger.id}}).then(deliveries => {
            this.deliveries = deliveries;
          });
        } else {
          this.isLogged = true;
          this.deliveries = [];
        }

      } else {
        this.phone = '';
        this.password = '';
      }
    });
  }

  @action async changeState(taskId, state) {
    this.tasksService = client.service('update_task_state');
    await this.tasksService.patch(taskId, {'state': state}).then((updatedTask) => {
      let updatedDeliveries = this.deliveries.map(delivery => {
        let tasks = delivery.tasks;
        const taskIndex = tasks.findIndex(({id}) => id === updatedTask.id);
        if (taskIndex !== -1) {
          let task = tasks[taskIndex];
          task['state'] = updatedTask['state'];
          tasks[taskIndex] = task;
        }
        delivery.tasks = tasks;
        return delivery;
      });

      this.deliveries = updatedDeliveries;

      if (state === 2) {
        client.service('send_tracking_page_sms').create({'taskId': updatedTask.id, 'messenger': this.messenger}).then(as => {

        });
      }
    });
  }
}

export default new MessengerStore();