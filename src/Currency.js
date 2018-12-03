import React, { Component } from 'react';
import './App.css';
import './flag-icon.min.css';
import {  InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap'

class Currency extends Component {
    render() {
        const { currencyName, rate, onChange } = this.props;
        const currFlag = currencyName.toLowerCase().slice(0,2);
        const flag = `flag-icon flag-icon-${currFlag} m-1`
        return (
            <div className='p-2'>
                <InputGroup >
                    <Input name={currencyName.toLowerCase()} data-rate={rate} className='currInput' type="number" onChange={onChange}  />
                    <InputGroupAddon addonType="append">
                        <InputGroupText style={{ width: 100 }}>
                        <span className={flag}></span>
                            {currencyName}
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </div>
    );
  }
}

export default Currency;