import React from 'react';
import UserProfile from "./UserProfile";
import {App, U} from "../../common";
import '../../assets/css/user/profile.scss'
import {Link} from "react-router-dom";
import {Icon} from "antd";
import Button from "antd/es/button";
import UserUtils from "./UserUtils";

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {}
        };
    }

    componentDidMount() {
        U.setWXTitle('个人中心');
        UserProfile.get().then((profile) => {
            this.setState({profile});
        })
    };

    render() {

        let {profile = {}} = this.state;
        let {user = {}} = profile;

        let {img, nick, mobile, email} = user;

        return <div className="profile-page">

            <div className='block-title'>头像</div>

            <div className='profile'>
                <img className='avatar' src={img}/>

                <ul className='info'>
                    <li>
                        昵称：{nick}
                    </li>
                    <li>
                        手机号：{mobile}
                    </li>
                    <li>
                        邮箱：{email}
                    </li>
                </ul>

                <ul className='info'>
                    <li>
                        <Button onClick={() => {
                            UserUtils.modUserPwd()
                        }}>
                            <Icon type="edit"/>
                            <span>修改密码</span>
                        </Button>
                    </li>
                    <li>
                        <Button onClick={() => {
                            UserUtils.modUserPro()
                        }}>

                            <Icon type="solution"/>
                            <span>修改资料</span>

                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    }
}