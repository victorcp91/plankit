import React, { useState, useEffect } from 'react';
import Geocode from "react-geocode";
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import { useDropzone } from 'react-dropzone';
import css from './SellerForm.module.scss';

Geocode.setApiKey("AIzaSyAEdNPMo1_StSwZRO_Cl4-NcUvehiDgs9g");
Geocode.enableDebug();

const SellerForm = props => {

  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [mapPosition, setMapPosition] = useState({
    lat: props.center ? props.center.lat : '',
    lng: props.center ? props.center.lng : ''
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: props.center ? props.center.lat : '',
    lng: props.center ? props.center.lng : ''
  })
  const [startingTime, setStartingTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  // useEffect(() => {
  //   let position = { lat: mapPosition.lat, lng: mapPosition.lng }
  //   if((!mapPosition.lat || !mapPosition.lng) && navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition((pos) => {
  //       setMapPosition({
  //         lat: pos.coords.latitude,
  //         lng: pos.coords.longitude
  //       })
  //       getGeocode();
  //     });
  //   }
  // }, []);

  // useEffect(() => { 
  //   getGeocode();  
  // }, [mapPosition]);

  // const getGeocode = () => {
  //   if(mapPosition.lat  &&  mapPosition.lng){
  //     Geocode.fromLatLng( mapPosition.lat , mapPosition.lng ).then(
  //       response => {
  //         const address = response.results[0].formatted_address,
  //         addressArray =  response.results[0].address_components,
  //         street = getStreet( addressArray ),
  //         number = getNumber( addressArray ),
  //         city = getCity( addressArray ),
  //         area = getArea( addressArray ),
  //         state = getState( addressArray ),
  //         country = getCountry (addressArray);
        
  //         setStreet( street ? street : '');
  //         setNumber( number ? number : '');
  //         setArea( area ? area : '');
  //         setCity( city ? city : '');
  //         setState( state ? state : '');
  //         setCountry( country ? country: '');
  
  //       },
  //       error => {
  //         console.error('erro', error);
  //       }
  //     );
  //   }
  // }
  const getStreet = ( addressArray ) => {
    let route = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'route' === addressArray[ i ].types[0] ) {
       route = addressArray[ i ].long_name;
       return route;
      }
     }
  }

  const getNumber = ( addressArray ) => {
    let number = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'street_number' === addressArray[ i ].types[0] ) {
       number = addressArray[ i ].long_name;
       return number;
      }
     }
  }

  const getCity = ( addressArray ) => {
    let city = '';
    for( let i = 0; i < addressArray.length; i++ ) {
     if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
      city = addressArray[ i ].long_name;
      return city;
     }
    }
  };

  const getArea = ( addressArray ) => {
    let area = '';
    for( let i = 0; i < addressArray.length; i++ ) {
     if ( addressArray[ i ].types[0]  ) {
      for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
       if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
        area = addressArray[ i ].long_name;
        return area;
       }
      }
     }
    }
  };

  const getState = ( addressArray ) => {
    let state = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
       state = addressArray[ i ].long_name;
       return state;
     }
    }
  };

  const getCountry = ( addressArray ) => {
    let country = '';
    for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'country' === addressArray[ i ].types[0] ) {
       country = addressArray[ i ].short_name;
       return country;
     }
    }
  };  

  const AsyncMap =withGoogleMap(
    props => (
      <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: mapPosition.lat, lng: mapPosition.lng }}
      >
        <Marker position={{ lat: mapPosition.lat, lng: mapPosition.lng }} />
      </GoogleMap>
    )
  );

  const handleAddressSelect = place => {
    if(place && place.address_components){
      const addressArray =  place.address_components,
      street = getStreet( addressArray ),
      number = getNumber( addressArray ),
      city = getCity( addressArray ),
      area = getArea( addressArray ),
      state = getState( addressArray ),
      country = getCountry ( addressArray ),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

      setStreet( street ? street : '');
      setNumber( number ? number : '');
      setArea( area ? area : '');
      setCity( city ? city : '');
      setState( state ? state : '');
      setCountry( country ? country: '');
      setMapPosition({
        lat: latValue,
        lng: lngValue,
      });
    }
  };

  const sendSellerRequest = (e) => {
    e.preventDefault();
    
  }
  return(
    <>
      <form className={css.sellerForm}>
        <h2 className={css.sectionSubTitle}>
          Contribua com a comunidade com os pontos de venda de plantas que você conhece.
        </h2>
        <div className={css.sellerContainer}>
          <span className={css.sellerFields}>
            <label className={css.labelField} htmlFor="storeName">Nome da Loja:</label>
            <input className={css.field} id="storeName"/>
            <label className={css.labelField} htmlFor="storeEmail">Email:</label>
            <input className={css.field} id="storeEmail" value={email}/>
            <label className={css.labelField} htmlFor="storePhone">Telefone:</label>
            <input className={css.field} id="storePhone"/>
            <label className={css.labelField} htmlFor="storeTime">Horário de Funcionamento:</label>
            <span className={css.workingTime}>
              <input className={`${css.field} ${css.time}`}  id="storeTime" name="startingTime" value={startingTime}/>
              <span className={css.separator}>as</span>
              <input className={`${css.field} ${css.time}`} id="storeTime" name="closingTime" value={closingTime}/>
            </span>
          </span>
        </div>
        
        <hr/>

        <h1 className={css.sectionTitle}>Localização</h1>
    
        <Autocomplete
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '16px',
            margin: '20px 0 20px 0',
            boxSizing: 'border-box',
            padding: '10px',
            fontSize: '14px'
          }}
          onPlaceSelected={ handleAddressSelect }
          types={['address']}
          componentRestrictions={{country: "br"}}
          placeholder="Buscar localização (Tente o endereço completo. Exemplo: Rua Rua Alpheu Portela, 993, Rio de Janeiro, RJ)"  
        />
        <div className={css.addressContainer}>
          <AsyncMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAEdNPMo1_StSwZRO_Cl4-NcUvehiDgs9g&libraries=places"
            loadingElement={
            <div style={{ height: '100%' }} />
            }
            containerElement={
            <div style={{ height: '300px', width: '50%', marginTop: '30px' }} />
            }
            mapElement={
            <div style={{ height: '100%' }} />
            }
          />
          <div className={`${css.addressFields} ${mapPosition.lat ? css.active : ''}`}>
            <span className={css.streetContainer}>
              <label className={`${css.labelField} ${css.street}`} htmlFor="storeAddress">Endereço:</label>
              <input className={`${css.field} ${css.street}`} id="storeAddress" name="address" value={street}/>
            </span>
            <span className={css.numberContainer}>
              <label className={`${css.labelField} ${css.number}`} htmlFor="storeAddress">Número:</label>
              <input className={`${css.field} ${css.number}`} id="storeAddress" name="address" value={number}/>
            </span>
            <label className={css.labelField} htmlFor="storeAddressComplement">Complemento:</label>
            <input className={css.field} id="storeAddressComplement" name="complement"/>
            <label className={css.labelField} htmlFor="storeCity">Cidade:</label>
            <input className={css.field} id="storeCity" name="city" value={city}/>
            <label className={css.labelField} htmlFor="storeState">Estado:</label>
            <input className={css.field} id="storeState" name="state" value={state}/>
            <label className={css.labelField} htmlFor="storeCountry">País:</label>
            <input className={css.field} id="storeCountry" name="country" value={country}/>   
          </div>
        </div>
   
        <buttom onClick={sendSellerRequest} className={css.sendButton}>Cadastrar</buttom>
      </form>
     </>
  );
}

export default SellerForm;