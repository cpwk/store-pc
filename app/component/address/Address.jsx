import React from 'react';
import {U} from "../../common";
import '../../assets/css/user/profile.scss'
import App from "../../common/App";
import {Avatar, Button, Card, Cascader, Icon, message, Modal, Tag} from "antd";
import Utils from '../../common/Utils'
import AddressUtils from "./AddressUtils";

export default class Address extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: []
        };
    }

    componentDidMount() {
        Utils.addr.loadRegion(this);
        U.setWXTitle('收货地址');
        this.loadData();
    };

    loadData = () => {
        App.api(`/user/address/addresss`, {
            addressQo: JSON.stringify({})
        }).then((v) => {
            this.setState({address: v});
        })
    };

    remove = (id, index) => {


        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api(`/user/address/remove`, {id}).then((v) => {
                    if (v == null) {
                        message.success("删除成功");


                        let address = this.state.address;
                        this.setState({
                            address: U.array.remove(address, index)


                        })
                    }
                })
            },
            onCancel() {
            },
        });
    };

    edit = (Address) => {
        AddressUtils.EditAddress(Address, this.loadData);
    };

    def = (id) => {

        Modal.confirm({
            title: `确认设为默认地址?`,
            onOk: () => {
                App.api(`/user/address/def`, {id}).then(() => {
                    message.success("设置成功");
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {address} = this.state;

        return <div className="profile-page">

            {address.map((item, index) => {
                let id = item.id;
                let def = item.def;
                let actions = [<Button onClick={() => {
                    this.edit(item)
                }}><Icon type="edit" key="setting"/>修改</Button>];
                if (def == 2) {
                    actions.push(<Button onClick={() => {
                        this.def(id)
                    }}><Icon type="setting" key="setting"/>设为默认</Button>);
                } else {
                    actions.push(<Button type="danger">默认地址</Button>)
                }
                actions.push(
                    <Button onClick={() => {
                        this.remove(id, index)
                    }}><Icon type="delete" key="setting"/>删除</Button>);

                return <Card
                    key={index}
                    title="收货地址"
                    hoverable={true}
                    style={{width: 350, float: "left"}}
                    actions={actions}>
                    <div>
                        <div> 收货人：{item.name}</div>
                        <div> 手机号：{item.mobile}</div>
                        <div> 地址：{Utils.addr.getPCD(item.code)}</div>
                        <div> 街道：{item.detail}</div>
                    </div>
                </Card>
            })}

            <Card
                title="添加新地址"
                hoverable={true}
                style={{width: 350, height: 248, float: "left"}}
                actions={[]}>
                <div>
                    <Tag color='red' onClick={() => {
                        this.edit({id: 0})
                    }}>
                        <Icon type="edit"/>
                        <span>添加新地址......</span>
                    </Tag>
                </div>
            </Card>

        </div>
    }
}