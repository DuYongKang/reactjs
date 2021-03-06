import React from 'react';
import PropTypes from 'prop-types';//在子组件使用PropTypes

export default class FieldComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:this.props.value,
            error:false,
        };
    }
    componentWillReceiveProps(update){
        this.setState({value:update.value});
    }

    onChange(evt){
        const name =this.props.name;
        const value=evt.target.value;
        //通过value传值
        const error = this.props.validate ? this.props.validate(value) : false;

        this.setState({value,error});

        this.props.onChange({name,value,error});//调用父组件的方法,传递参数
    }

    render(){
        return(
            <div>
                <input 
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                />
                <span style={{color:'red'}}>{this.state.error}</span>
            </div>
        )
    }
}

FieldComponent.propTypes={//使用PropTypes与父组件通信
    placeholder:PropTypes.string,
    name:PropTypes.string.isRequired,
    value:PropTypes.string,
    validate:PropTypes.func,
    onChange:PropTypes.func.isRequired,
};