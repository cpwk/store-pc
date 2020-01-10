import React from 'react'
import {App, CTYPE, U, Utils} from '../../common'
import {Button, Card, Dropdown, Icon, InputNumber, Menu, message, Modal, Table, Tag} from 'antd';
import '../../assets/css/common/common-edit.less'

import {inject, observer} from 'mobx-react'
import CarUtils from "./CarUtils";

@inject("carts")
@observer
export default class Car extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            car: [],
            selectedRowKeys: [],
            num: []
        };
    }

    remove = (id) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('user/car/remove', {id}).then(() => {
                    message.success('删除成功');
                    CarUtils.load().then((carts) => {
                        this.props.carts.setCarts(carts);
                    });
                })
            },
            onCancel() {
            },
        });
    };

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})

        },
    };

    cartSave = (productId, num) => {
        App.api('user/car/save', {car: JSON.stringify({productId: productId, num: num})}).then(
            () => {
                CarUtils.load().then((carts) => {
                    this.props.carts.setCarts(carts);
                });
            })
    };

    order = () => {
        let {selectedRowKeys} = this.state;
        if (selectedRowKeys.length == 0) {
            message.info("请选择商品");
        } else {
            let ids = encodeURIComponent(encodeURIComponent(JSON.stringify(selectedRowKeys)));
            App.go(`/ordertemp/${ids}`);
        }
    };

    render() {

        let {selectedRowKeys} = this.state;
        let totalNum = 0;
        let totalPrices = 0;
        let imgs = [];

        selectedRowKeys.map((id) => {
            let item = car.find(aa => aa.id === id);
            let {num, product} = item;
            let {price} = product;
            totalNum += parseInt(num);
            totalPrices += parseInt(price * num);
        });

        let car = this.props.carts.getCarts || [];

        car.map((item) => {
            imgs.push(item.img);
        });

        console.log(car);

        return <div>

            <Card bordered={false}>

                <Table
                    pagination={false}
                    rowSelection={this.rowSelection}

                    columns={[

                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            width: '60px',
                            render: (col, row, i) => {
                                return <span>{(i + 1)}</span>
                            },
                        },

                        {
                            title: '商品展示',
                            dataIndex: 'product.img',
                            className: 'txt-center',
                            width: '200px',
                            render: (img, item, index) => {
                                return <img key={img} style={{
                                    width: '60px',
                                    height: '60px',
                                    borderradius: '4px',
                                    cursor: 'pointer'
                                }} src={img + '@!120-120'} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, index);
                                }}/>
                            }
                        },

                        {
                            title: '商品名称',
                            dataIndex: 'product.name',
                            className: 'txt-center',
                            width: '200px'
                        },

                        {
                            title: '商品价格￥',
                            dataIndex: '',
                            className: 'txt-center',
                            width: '200px',
                            render: (item) => {
                                let {product} = item;
                                let {price} = product;
                                return <Tag color='cyan'>{price}￥</Tag>
                            }
                        },

                        {
                            title: '商品数量',
                            dataIndex: 'num',
                            className: 'txt-center',
                            render: (num, item) => {
                                return <InputNumber defaultValue={num} min={0}
                                                    onChange={(val) => {
                                                        this.cartSave(item.productId, val)
                                                    }}

                                />
                            }
                        },

                        {
                            title: '小计￥',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                let {num, product} = item;
                                let {price} = product;
                                let total = parseInt(num * price);
                                return <Tag color='purple'>{total}￥</Tag>
                            }
                        },

                        {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            width: '80px',
                            render: (obj, car, index) => {

                                return <Tag color="red" onClick={() => this.remove(car.id)}>
                                    删除
                                </Tag>
                            }
                        }

                    ]}

                    rowKey={(record) => record.id} dataSource={car}
                />

                <Button style={{float: 'right'}} type="danger" onClick={this.order}>结算</Button>
                <Button style={{float: 'right'}} type="dashed">总价格：{totalPrices}￥</Button>
                <Button style={{float: 'right'}} type="dashed">已选商品数量：{totalNum}</Button>

            </Card>

        </div>
    }
}