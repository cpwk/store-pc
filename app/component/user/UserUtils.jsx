import React from 'react';
import {Utils} from "../../common";
import UpdatePassword from '../SISU/UpdatePassword'
import UserEdie from './UserEdit'

let UserUtils = (() => {


    let modUserPwd = () => {
        Utils.common.renderReactDOM(<UpdatePassword/>);
    };

    let modUserPro = () => {
        Utils.common.renderReactDOM(<UserEdie/>);
    }

    return {
        modUserPwd, modUserPro
    }

})();

export default UserUtils;