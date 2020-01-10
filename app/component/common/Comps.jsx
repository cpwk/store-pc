import React from 'react'
import {Avatar, Carousel, Badge} from 'antd'
import '../../assets/css/common/comps.scss'
import {App, CTYPE} from "../../common";
import UserProfile from '../user/UserProfile'
import NavLink from '../../common/NavLink.jsx';
import {inject, observer} from 'mobx-react'


const menus = [
    {cn: '首页', en: 'HOME', path: '/'},
    {cn: '水果', en: 'FRUITS', path: '/products/13'},
    {cn: '零食', en: 'SNACKS', path: '/products/15'},
    {cn: '饮料', en: 'DRINKS', path: '/products/16'},
    {cn: '手机', en: 'PHONE', path: '/products/6'},
    {cn: '购物车', en: 'Car', path: '/car'},
];

class Banners extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            banners: this.props.banners,
            list: []
        }
    }

    go = (banner) => {
        let {url} = banner;
        if (url) {
            window.location.href = url;
        }
    };

    render() {

        let {banners = [], type} = this.state;
        let isHome = type === CTYPE.bannerTypes.HOME;
        let length = banners.length;

        return <div className={isHome ? 'main-carousel home-carousel' : 'main-carousel'}>
            {length > 0 && <Carousel autoplay={length > 1} dots={length > 1}
                                     speed={1000} autoplaySpeed={isHome ? 5000 : 4000} infinite>
                {banners.map((banner, index) => {
                    let {img, title} = banner;
                    return <div key={index} className='item'>
                        <div className='item'
                             style={{
                                 backgroundImage: `url(${img})`,
                                 backgroundPosition: '50% 50%',
                                 backgroundRepeat: 'no-repeat'
                             }}
                             onClick={() => {
                                 this.go(banner);
                             }}/>
                    </div>
                })}
            </Carousel>}
        </div>
    }
}

class Custevals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            limit: this.props.limit,
            list: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {limit = 4} = this.state;
        App.api('/usr/home/custevals', {limit}).then((list) => {
            this.setState({list})
        });
    };

    render() {

        let {list = []} = this.state;

        return <div className='custeval-list'>
            <div className='eval-header'/>
            <ul>
                {list.map((ce, index) => {
                    let {img, title, customer} = ce;
                    return <li key={index} className='item'>
                        <img src={img} className='img'/>
                        <div className='title'>{title}</div>
                        <div className='customer'>{customer}</div>
                    </li>
                })}
            </ul>
            <div className='clearfix-h20'/>
        </div>
    }
}

@inject("carts")
@observer
class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {}
        };
    }

    componentDidMount() {
        UserProfile.get().then((profile) => {
            this.setState({profile});
        })
    }

    render() {
        let {profile = {}} = this.state;
        let {user = {}} = profile;

        let count = this.props.carts.getCount || 0;

        return <div className="top-header">
            <div className="inner">
                <a href='/'>
                    <div className="logo"/>
                </a>

                {!user.id && <div className='btn' onClick={() => App.go('/signin')}>登入</div>}
                {user.id && <div className='btn' onClick={() => App.go('/user/profile')}>
                    <Avatar size={40} src={user.img}/>


                </div>}

                {count > 0 && <Badge count={count} style={{left: '648px', top: '10px'}}/>}

                <ul>
                    {menus.map((menu, index) => {
                        let {key, cn, en, path} = menu;
                        return <li key={index}>
                            <NavLink to={path} cn={cn} en={en}/>
                        </li>
                    })}
                </ul>

            </div>
        </div>
    }
}

class Footer extends React.Component {
    render() {
        return <div className="footer">
        </div>
    }
}

export {Banners, Custevals, Header, Footer,}