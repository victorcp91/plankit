import React, { useState, useEffect, useRef } from 'react';
import {useDropzone} from 'react-dropzone';

import filtersList from '../libs/filters.json';
import css from './NewPlant.module.scss';
import Api from '../libs/Api';


const newPlant = props => {

  const [imageFile, setImageFile] = useState(null);
  const [plantInfo, setPlantInfo] = useState({
    popularNamePtBr: '',
    otherPopularNamesPtBr: [],
    scientificName: ''
  });
  const [newPopularNamePtBr, setNewPopularNamePtBr] = useState('');
  const [aboutText, setAboutText] = useState('');

  const [filters, setFilters] = useState({
    direct_light: false,
    half_shadow: false,
    indirect_light: false,
    shadow: false,
    marshy_ground: false,
    moist_ground: false,
    dry_ground: false,
    sprinkler_watering: false,
    ground_planting: false,
    aerial_plant: false,
    water_plant: false,
    small_size: false,
    midsize: false,
    large: false,
    tree: false,
    vegetable_leaves: false,
    vegetable: false,
    herbs: false,
    pancs: false,
    fruitiful: false,
    floriferous: false,
    bindweed: false,
    thorns: false,
    poisonous: false,
  });

  const onDrop = acceptedFile => {
    setImageFile(acceptedFile);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png'
  });

  const handleInput = e => {
    const target = e.currentTarget;
    e.persist();
    if(target.name === 'otherPopularNamePtBr'){
      setNewPopularNamePtBr(target.value);
    }if(target.name === 'aboutText'){
      setAboutText(target.value);
    }else{
      setPlantInfo(info => ({
        ...info,
        [target.name]: target.value
      }));
    }
  }

  const deletePopularName = e => {
    let popularNames = plantInfo.otherPopularNamesPtBr;
    popularNames = popularNames.filter(name => name !== e.currentTarget.value);
    setPlantInfo(info => ({...info, otherPopularNamesPtBr: popularNames}))
  }

  const comparableString = term => {
    let preparedString = term.toLowerCase();
    const before = 'áàãâäéèêëíìîïóòõôöúùûü-';
    const converted = 'aaaaaeeeeiiiiooooouuuu ';
    let finalString = '';
    for(let i=0; i < preparedString.length; i++) {
      if(before.includes(preparedString[i])){
        const index = before.indexOf(preparedString[i]);
        finalString += converted[index];
      } else {
        finalString += preparedString[i];
      }
    }
    return finalString;
  }
  
  const addPopularName = e => {
    let popularNames = plantInfo.otherPopularNamesPtBr;
    let comparablePopularNames = [];
    popularNames.forEach(name => {
      comparablePopularNames.push(comparableString(name));
    })

    if(newPopularNamePtBr.length > 3 && 
      !comparablePopularNames.includes(comparableString(newPopularNamePtBr)) &&
      (comparableString(plantInfo.popularNamePtBr) !== comparableString(newPopularNamePtBr))) {
      popularNames.push(newPopularNamePtBr);
      setPlantInfo(info => ({...info, otherPopularNamesPtBr: popularNames}));
    }
    setNewPopularNamePtBr('');
  }
  const handleKeyDown = e => {
    if(e.key === 'Enter'){
      addPopularName(e);
    }
  }

  const changeFilter = e => {
    const target = e.currentTarget;
    e.persist();

    const currentValue = filters[target.name];
    setFilters(filters => ({...filters, [target.name]: !currentValue} ));
  }

  const fieldsVerification = () => {
    if(plantInfo.popularNamePtBr &&
      plantInfo.scientificName &&
      (filters.direct_light ||
      filters.half_shadow || 
      filters.indirect_light ||
      filters.shadow) &&
      (filters.marshy_ground ||
      filters.moist_ground ||
      filters.dry_ground ||
      filters.sprinkler_watering) &&
      (filters.ground_planting ||
      filters.aerial_plant ||
      filters.water_plant) && (
      filters.small_size ||
      filters.midsize ||
      filters.large ||
      filters.tree)) {
        return true;
      }
      return false;
  }

  const createNewPlant = () => {

    let orderedFilters = Object.keys(filters).filter(key => filters[key]).sort();
    const plant = {
      createdBy: props.user.uid,
      ...plantInfo,
      tags: orderedFilters,
      about: [{
        uid: props.user.uid,
        aboutPtBr: aboutText,
        usersWhoLiked: []
      }
    ]}

    Api.createNewPlant(imageFile[0], plant);
  }
 
  return (
    <>
      <section className={css.about}>
        {imageFile ? 
        <img
          src={URL.createObjectURL(imageFile[0])}
          className={css.imagePreview}
        />:
        <div {...getRootProps()} className={css.dragAndDropArea}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>}
        <div className={css.namingContainer}>
          <input
            className={css.field}
            placeholder="Nome popular principal*"
            type="text"
            name="popularNamePtBr"
            value={plantInfo['popularNamePtBr']}
            onChange={handleInput} 
          />
          <input
            className={css.field}
            placeholder="Nome científico*"
            type="text"
            name="scientificName"
            value={plantInfo['scientificName']}
            onChange={handleInput} 
          />
          <label>Outros nomes populares:</label>
          <span className={css.fieldContainer}>
            <input
              className={css.field}
              type="text"
              name="otherPopularNamePtBr"
              value={newPopularNamePtBr}
              onChange={handleInput} 
              onKeyDown={handleKeyDown}
            />
            <button onClick={addPopularName} className={css.addIcon}/>
          </span>
          <div className={css.popularNamesContainer}>
            {plantInfo.otherPopularNamesPtBr.map(name => (
              <span
                key={name}
                className={css.popularName}
              >
                {name}
                <button className={css.delete} value={name} onClick={deletePopularName}/>
              </span>
            ))}
          </div>
        </div>
      </section>
      <p className={css.requiredDisclaimer} >Os itens marcados com * são obrigatórios para cadastrar uma nova espécie</p>
      <section className={css.filterTags}>
        {filtersList.map(filter => {
          switch (filter.options_type){
            case 'choose':
              return (
                <div key={filter.title}>
                  <div className={css.checkItem}>
                    <input
                      type="checkbox"
                      id={filter.title}
                      onChange={changeFilter}
                      name={filter.title}
                      checked={filters[filter.title]}
                      className={css.checkInput}
                    />
                    <label
                      htmlFor={filter.title}
                      className={css.checkBoxStyle}
                      name={filter.title}
                    />
                    <label
                      htmlFor={filter.title}
                      className={`${css.inputText}`}
                      >{filter.label}</label>
                  </div>
                  <hr className={css.filterSectionSeparator}/>
                </div>
              )
            case 'check':
              return (
                <div key={filter.title}>
                  <div className={css.filterSectionTitle}>{filter.label}{filter.required ? '*': ''}</div>
                  {filter.options.map(option => (
                  !option.title.includes('hide') && <div key={option.title} className={css.checkItem}>
                    <input
                      type="checkbox"
                      id={option.title}
                      name={option.title}
                      className={css.checkInput}
                      onChange={changeFilter}
                      checked={filters[option.title]}
                    />
                    <label
                      htmlFor={option.title}
                      className={css.checkBoxStyle}
                      name={option.title}
                    />
                    <label
                      htmlFor={option.title}
                      className={`${css.inputText}`}
                      >{option.text}</label>
                  </div>
                  ))}
                  <hr className={css.filterSectionSeparator}/>
                </div>
              );
          }}
        )}
      </section>
      <section className={css.aboutText}>
        <textarea
          className={css.aboutTextField}
          placeholder="Conte mais sobre como cuidar dessa espécie..."
          value={aboutText}
          name="aboutText"
          onChange={handleInput}
        />
      </section>
      <button
        className={`${css.sendButton} ${fieldsVerification() ? css.active : ''} `}
        disabled={!fieldsVerification()}
        onClick={createNewPlant}
      >
        Cadastrar espécie
      </button>
    </>
  )
}

export default newPlant;