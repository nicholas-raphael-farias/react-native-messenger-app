import {observable, computed, action} from 'mobx';

import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from "react-native-contacts";


const getMonth = (month) => {
  switch (month) {
    case 0:
      return "Enero"
      break;
    case 1:
      return "Febrero"
      break;
    case 2:
      return "Marzo"
      break;
    case 3:
      return "Abril"
      break;
    case 4:
        return "Mayo"
        break;
    case 5:
        return "Junio"
        break;
    case 6:
      return "Julio"
      break;
    case 7:
      return "Agosto"
      break;
    case 8:
      return "Septiembre"
      break;
    case 9:
      return "Octubre"
      break;
    case 10:
      return "Noviembre"
      break;
    case 11:
      return "Diciembre"
      break;
    default:
      break;
  }
}

class MessengerStore {

  constructor(){
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "Quiero ver tus contactos."
      }).then(() => {
        
        Contacts.getAll((err, contacts) => {
          if (err === "denied") {
            console.warn("Permission to access contacts was denied");
          } else {
            console.warn(contacts)
            this.contacts = contacts
          }
        });


      });
    } else {
    }
  }


  @observable filters = []
  @observable filter_type = -1
  @observable type_opts = [
    {label:"Cita", value:"cita"}, 
    {label:"Junta", value:"junta"}, 
    {label:"Entrega de proyecto", value:"entrega"}, 
    {label:"Examen", value:"examen"},
    {label:"Otro", value:"otro"},
  ]
  @observable status_opts = [
    {label:"Pendiente", value:"pendiente"},
    {label:"Realizado", value:"realizado"},
    {label:"Aplazado", value:"aplazado"},
  ]
  @observable reminders = [
  ];
  @observable modals = {
    date_modal: false,
    time_modal: false,
    filter_day_modal: false,
    type_modal: false,
  }
  @observable contacts = [{label:"Contactos", value:"contactos", givenName:"name", recordID:"23234"}]
  @observable date = new Date()
  @observable time = new Date()
  @observable selected_reminder = null
  @observable type = 'cita'
  @observable desc = ''
  @observable status = 'pendiente'
  @observable contact = {label:"c", value:"c", givenName:"c", recordID:"c"}

  @action createReminder(){
    let d = this.date
    let t = this.time

    this.reminders = 
      this.reminders.concat([{
        id: '_' + Math.random().toString(36).substr(2, 9),
        type:this.type, 
        date:`${d.getDate()} de ${getMonth(d.getMonth())}`, 
        hour:`${t.getHours()}:${t.getMinutes() === 0 ? "00" : t.getMinutes()}`, 
        d: d,
        t: t,
        desc:this.desc, 
        status:this.status, 
        contact:this.contact
      }])

    this.type='cita'
    this.date=new Date()
    this.time=new Date()
    this.desc = ''
    this.status = 'pendiente'
    this.contact = {label:"c", value:"c", givenName:"c", recordID:"c"}
  }

  @action changeModalVisibility(modal, is_visible) {
    switch (modal) {
      case "date_modal":
        this.modals.date_modal = is_visible
        break;

      case "time_modal":
          this.modals.time_modal = is_visible
        break

      case "filter_day":
        this.modals.filter_day_modal = is_visible
        break;

      case "type_modal":
        this.modals.type_modal = is_visible
        break;
    
      default:
        break;
    }
  }

  @action changeValue(key, value){
    this[key] = value
  }

  @action addDayFilter(date){
    if(this.filter_type === 1 || this.filter_type === 3 || this.filter_type === 4){
      this.filters = this.filters.concat([{type:this.filter_type, date: date}])
      this.modals.filter_day_modal = false
      this.filter_type = -1
    } else if(this.filter_type === 2) {
      let f = this.filters.filter(f => f.type === 2 && f.final_date === null)
      if(f.length === 0) {
        this.modals.filter_day_modal = false
        this.filters = this.filters.concat([{type:2, initial_date: date, final_date: null}])
        setTimeout(() => {
          this.modals.filter_day_modal = true
          }, 1000);
      } else {
        f[0].final_date = date
        let i = this.filters.findIndex(f => f.type === 2 && f.final_date === null)  
        this.filters[i] = f[0]
        this.modals.filter_day_modal = false
        this.filter_type = -1
      }
    }
  }

  @action addTypeFilter(type) {
    this.filters = this.filters.concat([{type: this.filter_type, filter_type: type}])
    this.filter_type = -1
    this.modals.type_modal = false
  }

  @action setSelectedReminder(reminder){
    this.selected_reminder = reminder
  }

  @action changeStatus(id, value){
    let reminder = this.reminders.find(r => r.id === id)
    let reminder_index = this.reminders.findIndex(r => r.id === id)
    reminder.status = value
    this.reminders[reminder_index] = reminder
  }

  @action changeContact(id, value){
    let reminder = this.reminders.find(r => r.id === id)
    let reminder_index = this.reminders.findIndex(r => r.id === id)
    reminder.contact = value
    this.reminders[reminder_index] = reminder
  }

  @action deleteReminder(id){
    let index = this.reminders.findIndex(r => r.id === id)
    this.reminders.splice(index, 1)
  }

}

export default new MessengerStore();