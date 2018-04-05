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

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import scriptLoader from 'react-async-script-loader'
import jQuery from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/button.css';
import 'jquery-ui/themes/base/dialog.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/button';
import 'jquery-ui/ui/widgets/dialog';

import '../../styles/LocationPicker.css';
import '../../styles/location-dialog.css';

window.jQuery = jQuery;

const HOST = 'https://maps.google.com/maps/api/js';
const KEY = 'AIzaSyDv5pQYe9kRbolVUt0o8XSXSQl4g8BHrrQ';
const URL_google_api = `${HOST}?key=${KEY}`;

@scriptLoader(
  [URL_google_api],
  '/assets/location-dialog-min.js',
  '/assets/basil.min.js',
  '/assets/manage-local-storage.js',
)

@inject("store") @observer
class LocationPicker extends Component {

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.props.store.app.initMapDialog()
        this.props.store.app.initStorageManager(this.props.namespace)
        this.props.store.app.initLocationState()
      }
    }
  }

  render() {
        return (
            <div className="location-input-div">
              <div className="location-input-label">
                  <label><b>Current Location</b></label>
              </div>
              <div className="location-text">
                <span className="csftool-address-label">Address: </span>
                <span className="address-text">{this.props.store.app.getAddress}</span><br/>
                <span className="csftool-coordinates-label">Lat/Lon: </span>
                <span className="csftool-coordinates-text">{parseFloat(this.props.store.app.getLat).toFixed(2)}</span>
                <span className="csftool-coordinates-text">, </span>
                <span className="csftool-coordinates-text">{parseFloat(this.props.store.app.getLon).toFixed(2)}</span>
              </div>
              <div className="location-button">
                <button className="change-location" onClick={this.props.store.app.openMap}>
                    Change Location
                </button>
              </div>
            </div>
        )
  }

};

export default LocationPicker;
