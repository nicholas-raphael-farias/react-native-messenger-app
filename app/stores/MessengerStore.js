import {observable, computed, action} from 'mobx';

import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import NewPassword from '../screens/NewPassword';

import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

const API_URL = 'https://98a2af92.ngrok.io';

const socket = io(API_URL, {
  transports: ['websocket'],
  forceNew: true
});

const client = feathers();
client.configure(socketio(socket));

class MessengerStore {
  @observable phone;
  @observable password;
  @observable auxPhone;
  @observable auxPassword;
  @observable isLogged = false;
  @observable isActive = false;
  @observable onDuty = false;
  @observable messenger;
  @observable deliveries = [];
  @observable taskHistory = [];
  @observable locationId;
  @observable watchID;
  @observable currentTimestamp = 0;
  @observable latitude;
  @observable longitude;
  @observable newPassword;
  @observable newPasswordRepeat;
  @observable selectedTask;
  @observable selectedHistoryTask;
  @observable locationPermition;
  @observable locationResponseTest;
  @observable deliveriesService;
  @observable tasksService;
  @observable messengersService;
  @observable locationsService;

  constructor(){
    client.service('deliveries').on('patched', patchedDelivery => {

      if(patchedDelivery.state === -1) {

        const deliveryIndex = this.deliveries.findIndex(delivery => (delivery.id === patchedDelivery.id));
        if (deliveryIndex !== -1) {
          this.deliveries.splice(deliveryIndex,1); 
        }
      } else if(patchedDelivery.messengerId === this.messenger.id) {

        client.service('deliveries_and_tasks').find({'query': {'deliveryId': patchedDelivery.id}}).then((deliveryWithTasks) => {
          console.warn(deliveryWithTasks);
          let delivery = deliveryWithTasks[0];
          let tasks = delivery.tasks.sort((a, b) => parseInt(a.order) - parseInt(b.order));
          tasks.forEach(task => task.state = 1);
          delivery.tasks = tasks;
          console.warn(delivery.tasks);
          this.deliveries.push(delivery);
        });

      }
    });

    client.service('autoassign_signal').on('status', data => {
      client.service('deliveries_and_tasks').find({'query': {'deliveryId': data.deliveryId}}).then((deliveryWithTasks) => {
      console.warn(deliveryWithTasks);
      let deliveries = this.deliveries;
      const index = deliveries.findIndex(({id}) => id === data.deliveryId);
      let delivery = deliveries[index];
      let filteredTasks = deliveryWithTasks[0].tasks.filter(task => task.state !== 3);
      delivery.tasks = filteredTasks.sort((a, b) => parseInt(a.order) - parseInt(b.order));
      deliveries[index] = delivery;
      this.deliveries = deliveries;
      });
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

  @action setAuxPhone(phone) {
    this.auxPhone = phone;
  }

  @action setAuxPassword(password) {
    this.auxPassword = password;
  }

  @action setAuxIsLogged(logged) {
    this.auxIsLogged = logged;
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

  @action setSelectedHistoryTask(task) {
    this.selectedHistoryTask = task;
  }

  @action async updatePassword() {
    this.isLogged = false;
    
    await  client.service('messengers').patch(this.messenger.id, {'password': this.newPassword, 'is_active': true}).then((result) => {
    });
  }

  @action async updateLocation(location) {
    console.warn('updateLocation');
    client.service('locations')
    .patch(this.messenger.locationId, {
      'latitude': location.coords.latitude, 
      'longitude': location.coords.longitude
    }).then(() => {
      this.locationResponseTest = location;
    })
    .catch(error => {
      console.warn('error');
      console.warn(error);
    });
  }
 
  @action errorGeolocating(error) {
    console.warn(error);
  }

  @action async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.locationPermition = true;
        console.warn('You can use the camera');
      } else {
        console.warn('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  @action changeDutyStatus(status){
    if (status) {

      Geolocation.getCurrentPosition(
        (position) => {
            //console.warn(position);
            //console.warn(this.messenger);
            client.service('locations')
            .patch(this.messenger.locationId, {
              'latitude': position.coords.latitude, 
              'longitude': position.coords.longitude
            }).then(() => {

              client.service('update_messenger_status')
              .patch(this.messenger.id, {
                'on_duty': status
              }).then(() => {
                this.onDuty = status;

                this.watchID = Geolocation.watchPosition(
                  (l) => this.updateLocation(l), 
                  (e) => this.errorGeolocating(e),
                  {
                    enableHighAccuracy: true, 
                    distanceFilter: 25
                });

              });

            });
        },
        (error) => {
            // See error code charts below.
            console.warn(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
      
    } else {
      client.service('update_messenger_status').patch(this.messenger.id, {'on_duty': status}).then(() => {
        Geolocation.clearWatch(this.watchID);
        Geolocation.stopObserving();
        this.onDuty = status;
      });

    }
  }

  @action async authMessenger() {
    this.messengersService = client.service('messengers');
    this.deliveriesService = client.service('messenger_deliveries');
    this.historyService = client.service('messenger_history');

    await this.messengersService.find({'query': {'phone': this.phone, 'password': this.password}}).then((result) => {
      if (result.length > 0) {
        this.messenger = result[0];
        this.isActive = this.messenger.is_active;
        this.onDuty = this.messenger.on_duty;
        this.isLogged = true;
        this.deliveriesService.find({'query': {'messengerId': this.messenger.id}}).then(deliveries => {
          let deliveriess = deliveries.map(delivery => {
            delivery.tasks = delivery.tasks.sort(function(task_a, task_b) {
              return task_a.order - task_b.order;
            });
            return delivery;
          });
          this.deliveries = deliveriess;
        });

        this.historyService.find({'query':{'messengerId': this.messenger.id}}).then((deliveries) => {
          this.taskHistory = deliveries;
        });
  


        if(this.isActive && this.onDuty){
          this.watchID = Geolocation.watchPosition(
            (l) => this.updateLocation(l), 
            (e) => this.errorGeolocating(e),
            {
              enableHighAccuracy: true, 
              distanceFilter: 25
          });

        }
      } else {
        this.phone = '';
        this.password = '';
      }
    });
  }

  @action async auxAuthMessenger() {
    this.messengersService = client.service('messengers');
    this.deliveriesService = client.service('messenger_deliveries');
    this.historyService = client.service('messenger_history');

    await this.messengersService.find({'query': {'phone': this.auxPhone, 'password': this.auxPassword}}).then((result) => {
      if (result.length > 0) {
        this.messenger = result[0];
        this.isActive = this.messenger.is_active;
        this.onDuty = this.messenger.on_duty;
        this.auxIsLogged = true;
        this.deliveriesService.find({'query': {'messengerId': this.messenger.id}}).then(deliveries => {
          this.deliveries = deliveries;
        });

        this.historyService.find({'query':{'messengerId': this.messenger.id}}).then((deliveries) => {
          this.taskHistory = deliveries;
        });
  


        if(this.isActive && this.onDuty){
          this.watchID = Geolocation.watchPosition(
            (l) => this.updateLocation(l), 
            (e) => this.errorGeolocating(e),
            {
              enableHighAccuracy: true, 
              distanceFilter: 25
          });

        }
      } else {
        this.auxPhone = '';
        this.auxPassword = '';
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

        if(this.updatedTask.attrs.recipient !== undefined){

          if(this.updatedTask.attrs.recipient !== 'NO_RECIPIENT'){
            client.service('send_tracking_page_sms').create({'taskId': updatedTask.id, 'phone': this.updatedTask.attrs.phone});
          }
        }    
      } else if (state === 3){
        let deliveries = this.deliveries;
        let historyDeliveries = this.taskHistory;

        let updatedDeliveryIndex = deliveries.findIndex(({id}) => id === updatedTask.deliveryId);
        let updatedDelivery = deliveries[updatedDeliveryIndex];
        let taskIndex = updatedDelivery.tasks.findIndex(({id}) => id === updatedTask.id);
        let task = updatedDelivery.tasks[taskIndex];

        historyDeliveries.push({tasks: [task]});
        this.taskHistory = historyDeliveries;

        updatedDelivery.tasks.splice(taskIndex, 1);
        deliveries[updatedDeliveryIndex] = updatedDelivery;

        this.deliveries = deliveries;
      }

    });
  }

  @action changeSuccessStatus(taskId){
    client.service('tasks')
    .patch(taskId, {succeded: false})
    .then((task) => {
      
    });
  }

}

export default new MessengerStore();