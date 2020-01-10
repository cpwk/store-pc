import React from 'react'

import App from '../../common/App.jsx'

import Utils from '../../common/Utils.jsx'
import {Form, Icon, Input, message, Modal} from 'antd';
import CTYPE from "../../common/CTYPE";

const FormItem = Form.Item;
const id_div = 'div-dialog-mod-pwd';

class UpdatePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        };
    }

    componentDidMount() {
        this.genValCode();
    }

    updatePassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {
                let {key} = this.state;
                let {password, newpassword, renewpassword, code} = user;
                let {mobile} = App.userProfile();
                if (newpassword !== renewpassword) {
                    message.info('两次输入的密码不一致，请重新输入!');
                    return;
                }
                App.api('user/update_password', {
                    mobile, password, newpassword, vCode: JSON.stringify({
                        key,
                        code
                    })
                }).then(res => {
                    message.success("修改密码成功！请重新登录");
                    setTimeout(() => {
                        App.go(`/SignIn`);
                    }, 1000);
                })
            }
        });
    };

    genValCode = () => {
        let key = new Date().getTime();
        this.setState({key: key});
        this.setState({
            img_src: App.API_BASE + '/support/vcode/vcode?key=' + key,
            valCode: {key, code: ''}
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let {img_src} = this.state;
        return <Modal title={'修改密码'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'500px'}
                      onOk={this.updatePassword}
                      onCancel={this.close}>
            <Form>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>当前密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入当前密码',
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="unlock"/></span>}/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>新密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('newpassword', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="unlock"/></span>}/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>确认密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('renewpassword', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="unlock"/></span>}/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>验证码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('code', {
                        rules: [{
                            type: 'string',
                            message: '请输入验证码',
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="number"/></span>}/>
                    )}
                </FormItem>
                <img src={img_src} style={{width: '80px', marginTop: '1px', marginLeft: '35px'}}
                     onClick={this.genValCode}/>
            </Form>
        </Modal>
    }
}

export default Form.create()(UpdatePassword);