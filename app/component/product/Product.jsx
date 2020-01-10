import React from 'react'
import App from '../../common/App.jsx'
import {Form, Icon, Button, message, InputNumber, Card} from 'antd';
import UserProfile from "../user/UserProfile";
import {inject, observer} from 'mobx-react'
import CarUtils from "../car/CarUtils";

@inject("carts")
@observer
class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            product: {},
            profile: {},
            num: 1
        };
    }

    componentDidMount() {


        UserProfile.get().then((profile) => {
            this.setState({profile});
        });

        let {id} = this.state;
        App.api('adm/product/product', {id}).then((product) => {
            this.setState({product});
        })
    };

    car = () => {
        let {product, profile, num} = this.state;
        let productId = product.id;
        let userId = profile.user.id;
        App.api('user/car/save', {

                car: JSON.stringify({
                        productId,
                        userId,
                        num
                    }
                )
            }
        ).then(() => {
            message.success('加入成功，请尽快结算哦，亲亲！');
            CarUtils.load().then((carts) => {
                this.props.carts.setCarts(carts);
            });
        });
    };

    render() {
        let {product} = this.state;
        let {img, name, price} = product;

        return <div>

            <Card
                key={1}
                title="商品详情"
                style={{width: 444, float: "center"}}
                cover={<img alt="example" src={img}/>}
                actions={[

                    <InputNumber min={1} defaultValue={1} onChange={(v) => {
                        this.setState({num: v})
                    }}/>,

                    <Button onClick={this.car}>
                        <Icon type="shopping-cart" key="setting"/>加入购物车</Button>,

                ]}>
                <div>
                    <div> {name}</div>
                    <div> ￥{price}</div>
                </div>
            </Card>
        </div>
    }
}

export default Form.create()(Product);