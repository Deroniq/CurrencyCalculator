import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import './flag-icon.min.css';
import Currency from './Currency';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from 'reactstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons'

library.add(faSlidersH)


class ListRates extends Component {

  render () {
    
    return (  
      <div className='d-flex flex-row flex-wrap'>
        {this.props.rates.map(rate => {
            let isTrue = false
            if(this.props.currencesChecked.get(rate.code)) {
                isTrue = true
            } 
            const currFlag = rate.code.toLowerCase().slice(0,2);
            const flag = `flag-icon flag-icon-${currFlag} m-1`;
            const label = <span><span className={flag}></span>{rate.currency}</span>
            return (
              <div className='p-1' style={{ width: 330 }} key={rate.code}>
                
                <CustomInput 
                  checked={isTrue} 
                  onChange={this.props.change} 
                  type='checkbox' 
                  key={rate.code} 
                  id={rate.code} 
                  label={label}  />
              </div>
              )
            }
        )}
      </div>
    )
    
  }

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currences: new Map([ ['PLN',true], ['USD',true], ['EUR',true] ]),
      currencesNbp: [],
      rates: [],
      currencyValue: 0,
      loading: true,
      settingOpen: false,
      currAmount: 6
    }

    this.onCurrencyChecked = this.onCurrencyChecked.bind(this);
  }
  
  componentDidMount() {
    axios.get("http://api.nbp.pl/api/exchangerates/tables/A?format=json")
      .then(res => {
          const dataAPI = res.data[0];
          const ratesAr = [];
          for(const ratesLoop of dataAPI.rates) {
            ratesAr[ratesLoop.code] = ratesLoop.mid;
          }
          ratesAr['PLN'] = 1;
          this.setState({
                currencesNbp: dataAPI,
                rates: ratesAr,
                ratesApi: dataAPI.rates,
                loading: false
              });
          //console.log(this.state.rates);
        })
        .catch(error => {
          console.log(error);
        });
  }

  updateCurrency = event => {
    this.setState({currencyValue: event.target.value});
    const currInputs = document.querySelectorAll('.currInput');
    for(const calc of currInputs) {
      if(calc.name !== event.target.name) {
        //console.log(`other: ${calc.name}`);
        const currNew = event.target.value * (event.target.dataset.rate / calc.dataset.rate);
        calc.value = parseFloat(currNew).toFixed(2);
      }
      //console.log(calc.name); 
    }
    
  }

  onCurrencyChecked = (e) => {
    const item = e.target.id
    const isChecked = e.target.checked
    this.setState(prevState => ({ currences: prevState.currences.set(item, isChecked) }))
    let settingChecked = document.querySelectorAll("input[type=checkbox]:checked")
    let settingUnchecked = document.querySelectorAll("input[type=checkbox]:not(:checked)")
    if(settingChecked.length >= this.state.currAmount) {
      //window.alert("za dużo")
      for(let e of settingUnchecked) {
        e.disabled = true
      }
    } else {
      for(let e of settingUnchecked) {
        e.disabled = false
      }
    }
    
    
  }

  evOpen = () => this.setState({ settingOpen: true }); 
  evClose = () => this.setState({ settingOpen: false }); 
  
  render() {
    const { currences, currencesNbp, currAmount, rates, ratesApi, loading, settingOpen } = this.state;
    const modalWidth = { 
      width: 700,
      maxWidth: 700
    }
    let tempSetting = []
    for(let e of currences.entries()) {
      if(e[1]) {
        tempSetting.push(e[0])
      }
      
    }
    const curentAmount = document.querySelectorAll("input[type=checkbox]:checked")
    console.log(tempSetting)
    return (
      <div className="App d-flex justify-content-center h-100 flex-column align-items-center">
        <div className="currency-box shadow-lg p-3 mb-5 rounded text-left">
          <div className="float-right">
            <Button onClick={this.evOpen} color='light'><FontAwesomeIcon icon="sliders-h" /></Button>
          </div>
          <div className="lead titleApp p-2">KALKULATOR<br />WALUTOWY</div>
          
          { loading === false ? tempSetting.map(curr => <Currency 
                                                        currencyName={curr} 
                                                        rate={rates[curr]} 
                                                        onChange={this.updateCurrency} 
                                                        key={curr}/>) 
                                                    : 'loading...' }
          <div className="p-2 text-center">Kurs {currencesNbp.no}<br />z dnia {currencesNbp.effectiveDate}</div>
        </div> 
        <Modal style={modalWidth} isOpen={settingOpen}>
          <ModalHeader>Wybierz waluty {curentAmount.length}/{currAmount}</ModalHeader>
          <ModalBody>
          { loading === false ? <ListRates rates={ratesApi} currencesChecked={currences} change={this.onCurrencyChecked} /> : 'loading...' }
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.evClose} color='success'>Gototwe</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;