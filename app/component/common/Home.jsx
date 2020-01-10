import React from 'react'
import U from "../../common/U";
import {App, CTYPE, Utils} from "../../common/index";
import {Banners, Custevals} from "./Comps";
import '../../assets/css/home/home.scss'
import '../../assets/css/product/products.scss'
import {ProductList} from "../product/Products";

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            banners: [],
            list: [],
            pagination: {
                pageSize: 12,
                current: 0,
                total: 0
            }
        }
    }

    componentDidMount() {
        U.setWXTitle('首页');
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}} = this.state;

        App.api('/usr/home/products', {
            productQo: JSON.stringify({
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

        App.api('/usr/home/banners', {bannerQo: JSON.stringify({type: 1})}).then((banners) => {
            this.setState({banners})
        });
    };

    render() {

        let {banners = [], list = []} = this.state;

        return <div className='home-page'>

            {banners.length > 0 && <Banners banners={banners} type={CTYPE.bannerTypes.HOME}/>}

            <ProductList list={list}/>

            <div className='cases-header-home'/>

        </div>
    }
}
