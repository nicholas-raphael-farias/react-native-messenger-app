
import React, { Component } from 'react'
import { Picker } from 'native-base'


const AgendaPicker = ({value, onValueChange, opts}) => {
  return(
    <Picker
      mode="dropdown"
      style={{ width: undefined, color:"#FFF" }}
      placeholder="Categoria"
      placeholderStyle={{ color: "#FFF" }}
      placeholderIconColor={{color:"#FFF"}}
      selectedValue={value}
      onValueChange={onValueChange}
    >
      {opts.map(opt => {
        return(
          <Picker.Item label={opt.label} value={opt.value} style={{color:"#FFF"}} />
        )
      })}
    </Picker>
  );
}

export default AgendaPicker