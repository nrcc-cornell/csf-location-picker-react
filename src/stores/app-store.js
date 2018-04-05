///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming Location Picker
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { observable, computed, action } from 'mobx';
import jQuery from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/button';

export class AppStore {
    // -----------------------------------------------------------------------------------
    // Location Picker -------------------------------------------------------------------
    // For Components: LocationPicker ----------------------------------------------------
    // -----------------------------------------------------------------------------------
    map_dialog=null;
    manage_local_storage=null;

    // Location ID -------------------------------------------
    @observable location_id='default';
    @action updateLocationId = (i) => {
            this.location_id = i;
        }
    @computed get getLocationId() {
            return this.location_id
        }

    // Location coordinates ----------------------------------
    @observable lat='42.50';
    @observable lon='-76.50';
    @action updateLocation = (lt,ln) => {
            if ((this.getLat !== lt) || (this.getLon!==ln)) {
                this.lat = lt;
                this.lon = ln;
            }
        }
    @computed get getLat() {
            return this.lat
        }
    @computed get getLon() {
            return this.lon
        }

    // Location address --------------------------------------
    @observable address='Cornell University, Ithaca, NY';
    @action updateAddress = (a) => {
            this.address = a;
        }
    @computed get getAddress() {
            return this.address
        }


    // Location default --------------------------------------
    @observable default_location;
    @action updateDefaultLocation = () => {
            this.default_location = {address:this.getAddress, lat:parseFloat(this.getLat), lng:parseFloat(this.getLon), id:this.getLocationId};
        }
    @computed get getDefaultLocation() {
            return this.default_location
        }


    // Initialize the local storage manager
    @action initStorageManager = (namespace) => {
        //console.log('initStorageManager');
        let storage_options = {
            namespace: namespace,
            expireDays: 3650
        }
        jQuery().CsfToolManageLocalStorage(storage_options);
        this.manage_local_storage = jQuery().CsfToolManageLocalStorage();
        this.manage_local_storage("init");
    }

    // Initialize the location state
    @action initLocationState = () => {
        //console.log('initLocationState');
        let selected_id = this.manage_local_storage("read","selected");
        let locations = this.manage_local_storage("read","locations");
        let loc_obj = null;
        if (locations !== undefined) {
            loc_obj = locations[selected_id]
        } else {
            loc_obj = null
        }

        this.updateDefaultLocation();
        if (loc_obj) {
            this.updateLocationId(loc_obj.id);
            this.updateAddress(loc_obj.address);
            this.updateLocation(loc_obj.lat.toString(),loc_obj.lng.toString());
        } else {
            this.updateLocationId(this.default_location.id);
            this.updateAddress(this.default_location.address);
            this.updateLocation(this.default_location.lat.toString(),this.default_location.lng.toString());
            // WRITE DEFAULT LOCATION IF NO LOCATIONS EXIST
            this.manage_local_storage("write","locations",{default: this.default_location});
            this.manage_local_storage("write","selected",this.default_location.id);
        }
    }

    // Initialize the map dialog
    @action initMapDialog = () => {
            //console.log('initMapDialog');
            //var default_location = this.getDefaultLocation
            var default_location = {address:this.getAddress, lat:parseFloat(this.getLat), lng:parseFloat(this.getLon), id:"default"};
            //var options = { width:600, height:500, google:google, default:default_location };
            var options = { width:600, height:500, google:window.google, default:default_location };
            jQuery(".csftool-location-dialog").CsfToolLocationDialog(options);
            this.map_dialog = jQuery(".csftool-location-dialog").CsfToolLocationDialog();
            this.map_dialog("bind", "close", (ev, context) => {
                let loc_obj = context.selected_location;
                this.updateLocationId(loc_obj.id);
                this.updateAddress(loc_obj.address);
                this.updateLocation(loc_obj.lat.toString(),loc_obj.lng.toString());

                // WRITE LOCATIONS THE USER HAS SAVED
                this.manage_local_storage("write","locations",context.all_locations);
                this.manage_local_storage("write","selected",this.getLocationId);

                // REMOVE LOCATIONS THE USER HAS DELETED
                var idsToDelete = this.manage_local_storage("getExtraKeys", "locations", context.all_locations);
                this.manage_local_storage("delete", "locations", idsToDelete);
            });
        }

    // Open map with all saved locations
    @action openMap = () => {
            let locations = this.manage_local_storage("read","locations");
            let selected_id = this.manage_local_storage("read","selected");
            this.map_dialog("locations", locations);
            this.map_dialog("open", selected_id);
        }

}

