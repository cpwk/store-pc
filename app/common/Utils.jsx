import React from 'react';
import * as ReactDOM from "react-dom";
import LocaleProvider from "antd/es/locale-provider";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ImgLightbox from "./ImgLightbox";
import CTYPE from './CTYPE';


let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let {id} = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            } else {

            }

            document.body.appendChild(div);
            ReactDOM.render(<LocaleProvider locale={zhCN}>{child}</LocaleProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let scrollTop = function () {

            let x = document.body.scrollTop || document.documentElement.scrollTop;
            console.log(x);
            let timer = setInterval(function () {
                x = x - 100;
                if (x < 100) {
                    x = 0;
                    window.scrollTo(x, x);
                    clearInterval(timer);
                }
                window.scrollTo(x, x);
            }, 20);
        };

        return {
            closeModalContainer, createModalContainer, scrollTop, renderReactDOM
        }
    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let {pageable = {}, totalElements, totalPages} = result;

            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.pageNumber + 1;

            return {
                current,
                total: totalElements, totalPages,
                pageSize
            }
        };

        return {convert2Pagination}

    })();

    let showImgLightbox = (images, index) => {
        common.renderReactDOM(<ImgLightbox images={images} index={index} show={true}/>);
    };

    let addr = (() => {

        let regions = [];

        let loadRegion = (component) => {
            if (regions && regions.length > 0) {
                component.setState({
                    regions: regions
                });
            } else {
                fetch(CTYPE.REGION_PATH).then(res => {
                    res.json().then((_regions) => {
                        regions = _regions;
                        component.setState({
                            regions: _regions
                        });
                    });
                });
            }
        };

        let getCodes = (code) => {
            let codes = [3];
            if (code && code.length === 6) {
                codes[0] = code.substr(0, 2);
                codes[1] = code.substr(0, 4);
                codes[2] = code;
            }
            return codes;
        };

        let getPCD = (code) => {
            if (!regions || regions.length === 0 || !code || code === '') {
                return null;
            }
            let codes = getCodes(code);
            let pcd = '';
            regions.map((r1, index1) => {
                if (r1.value === codes[0]) {
                    pcd = r1.label;
                    r1.children.map((r2, index2) => {
                        if (r2.value === codes[1]) {
                            pcd += ' ' + r2.label;
                            r2.children.map((r3, index3) => {
                                if (r3.value === code) {
                                    pcd += ' ' + r3.label;
                                }
                            })
                        }
                    })
                }
            });
            return pcd;
        };

        return {loadRegion, getPCD, getCodes}

    })();

    return {
        common, pager, _setCurrentPage, _getCurrentPage, showImgLightbox, addr
    };

})();

export default Utils;