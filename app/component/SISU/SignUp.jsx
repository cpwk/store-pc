import React from 'react';
import {Form, Icon, Input, message, Checkbox, Button} from 'antd';
import App from '../../common/App.jsx';

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeChange: "",
            time: 60,
            btnDisable: false,
            btnContent: '获取验证码',
            user: {},
            key: "",
            codeMobile: ''
        }
    }

    checkphone = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                let {mobile} = values;
                let regex = /^1[34578]\d{9}$/;
                if (regex.test(mobile)) {
                    this.sendCode();
                    this.getVcode()
                } else {
                    message.info("请输入正确的手机号")
                }
            }
        })
    };

    getVcode = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                let {mobile} = values;
                this.setState({codeMobile: mobile});
                let key = new Date().getMilliseconds();
                this.setState({key: key});
                App.api('/support/sms/phone_vcode', {key, mobile}).then((result) => {
                    if (result == "success") {
                        message.success("验证码发送成功，请注意查收")
                    }
                });
            }
        })
    };

    sendCode = () => {

        this.setState({
            btnDisable: true,
            btnContent: "60s之后重新获取",
            timeChange: setInterval(this.clock, 1000),
        });
    };

    clock = () => {

        let {timeChange} = this.state;
        let {time} = this.state;

        if (time > 0) {
            time = time - 1;
            this.setState({
                time: time,
                btnContent: time + "s之后重新获取",
            });
        } else {
            clearInterval(timeChange);
            this.setState({
                btnDisable: false,
                time: 60,
                btnContent: "获取验证码",
            });
        }
    };

    signup = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {

                let {user = {}, key, codeMobile} = this.state;

                let {mobile, email, nick, password, repassword, agreement, smsCode} = values;

                let addressId = null;
                let img = null;

                if (codeMobile != mobile) {
                    message.error("注册与接收验证码的手机号不一致");
                    return;
                }
                if (agreement !== true) {
                    message.info("请详细阅读并同意用户协议");
                    return;
                }
                if (password !== repassword) {
                    message.info('两次输入的密码不一致，请重新输入!');
                    return;
                }
                App.api('user/sign_up', {
                    user: JSON.stringify({
                        ...user,
                        mobile,
                        email,
                        nick,
                        password,
                        addressId,
                        img
                    }),
                    key,
                    smsCode,
                }).then((result) => {
                    if (result == "success") {
                        message.success('注册成功! 请登录');
                        App.go(`/SignIn`);
                    }
                })
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return <div style={{width: '100vw', position: 'relative'}}>

            <Form className="login-form" style={{
                width: '280px',
                position: 'absolute',
                left: '50%',
                marginLeft: '-140px',
                paddingTop: '110px'
            }}>

                <Form.Item>
                    {getFieldDecorator('email', {
                        rules: [{required: true, message: '邮箱不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入邮箱"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('nick', {
                        rules: [{required: true, message: '昵称不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="smile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入昵称"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('repassword', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请确认密码"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('mobile', {
                        rules: [{required: true, message: '手机号不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入手机号"
                        />,
                    )}
                </Form.Item>

                <Form.Item style={{float: 'left', width: '130px'}}>
                    {getFieldDecorator('smsCode', {})(
                        <Input
                            prefix={<Icon type="number" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入验证码"
                        />,
                    )}

                </Form.Item>

                <Button type="primary" disabled={this.state.btnDisable} className="login-form-button"
                        style={{width: '140px', marginTop: '5px', marginLeft: '5px'}} onClick={() => {
                    this.checkphone();
                }}>{this.state.btnContent}</Button>

                <Form.Item>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(<Checkbox>
                        我已详细阅读并同意
                        <a href="http://terms.alicdn.com/legal-agreement/terms/suit_bu1_taobao/suit_bu1_taobao201703241622_61002.html?spm=a2145.7275745.0.0.40525d7cYrImSW">
                            用户协议</a>
                    </Checkbox>)
                    }
                </Form.Item>

                <Form.Item>

                    <Button type="primary" htmlType="submit" className="login-form-button"
                            style={{width: '100%'}}
                            onClick={() => {
                                this.signup()
                            }}>
                        注册
                    </Button>

                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                App.go(`/signin`)
                            }}>
                        账号已存在？直接登陆
                    </Button>

                </Form.Item>

            </Form>
        </div>;
    }
}

export default Form.create()(SignUp);