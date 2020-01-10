import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Input, InputNumber, message, Modal, Select, Form} from 'antd';
import '../../assets/css/common/common-edit.less'
import {CTYPE, OSSWrap} from "../../common";
import UserProfile from "./UserProfile";

const id_div = 'div-dialog-user-edit';
const FormItem = Form.Item;
const Option = Select.Option;

class UserEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: [],
            uploading: false,
            checkedKeys: []
        };
    }


    componentDidMount() {

        UserProfile.get().then((profile) => {
            let {user = {}} = profile
            this.setState({user: user});
            console.log(profile)
        })


    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    submit = () => {

        let {user = {}} = this.state;

        App.api('user/save', {
                user: JSON.stringify(user)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    handleNewImage = e => {

        let {uploading, user = {}} = this.state;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});

        OSSWrap.upload(img).then((result) => {
            this.setState({
                user: {
                    ...user,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    render() {
        let {user = {}} = this.state;
        let {nick, mobile, email, img} = user;
        return <Modal title={'编辑个人信息'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p>更改昵称：</p>
                        <Input style={{width: 300}} className="input-wide"
                               value={nick} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           nick: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p>更改手机号：</p>
                        <Input style={{width: 300}} className="input-wide"
                               value={mobile} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           mobile: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p>更改邮箱：</p>
                        <Input style={{width: 300}} className="input-wide"
                               value={email} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           email: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p'>更换头像</p>
                        <div>
                            <div className='upload-img-preview' style={{width: '480px', height: '182px'}}>
                                {img && <img src={img} style={{width: '480px', height: '182px'}}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>{'1920*1920'}</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Modal>
    }
}

export default Form.create()(UserEdit);