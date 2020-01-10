import React from 'react'
import U from "../../common/U";
import {App, CTYPE, Utils} from "../../common";
import {Icon, Pagination, Button, InputNumber, Card} from 'antd';
import '../../assets/css/product/products.scss'

export default class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortId: parseInt(this.props.match.params.sortId),
            list: [],
            pagination: {
                pageSize: 12,
                current: 0,
                total: 0
            }
        }
    }

    componentDidMount() {
        U.setWXTitle('商品');
        this.loadData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let _sortId = parseInt(nextProps.match.params.sortId);
        console.log(_sortId);
        let {pagination = {}, sortId} = this.state;
        this.setState({pagination: {...pagination, current: 1}, sortId: _sortId}, () => {
            this.loadData();
        })


    }

    loadData = () => {

        let {pagination = {}, sortId} = this.state;

        App.api('/usr/home/products', {
            productQo: JSON.stringify({
                sortId,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content,
                pagination
            });
        });
    };

    onPageChange = (current, pageSize) => {
        let pagination = this.state.pagination;
        this.setState({
            pagination: {
                ...pagination,
                current, pageSize
            }
        }, () => this.loadData());
    };

    render() {

        let {list = [], pagination = {}} = this.state;

        return <div className='products-page'>

            <ProductList list={list}/>

            <Pagination {...CTYPE.commonPagination}
                        onChange={(current, pageSize) => this.onPageChange(current, pageSize)}
                        onShowSizeChange={(current, pageSize) => {
                            this.onPageChange(current, pageSize)
                        }}
                        current={pagination.current} pageSize={pagination.pageSize} total={pagination.total}/>

            <div className='clearfix-h20'/>

        </div>

    }
}

export class ProductList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({list: nextProps.list})
    }

    show = (product) => {
        App.go(`/product/${product.id}`)
    };

    render() {
        let {list = []} = this.state;
        return <div>
            {list.map((product, index) => {
                let {img, name, price} = product;
                return <Card
                    onClick={() => this.show(product)}
                    key={index}
                    style={{width: 333, height: 333, float: 'left'}}
                    cover={<img alt="example" src={img} style={{width: 333, height: 222}}/>}
                    actions={[
                        <Button type="danger">
                            <Icon key="setting"/>{name}</Button>,
                        <Button type="danger">
                            <Icon key="setting"/>￥{price}</Button>,
                    ]}>
                </Card>
            })}
            <div className='clearfix-h20'/>
        </div>
    }
}