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
import { inject, observer} from 'mobx-react';

// Components
import LocationPicker from '../../components/LocationPicker';

// Styles
import '../../styles/App.css';

@inject('store') @observer
class App extends Component {

    render() {

        return (
            <div className="App">
                <LocationPicker
                  namespace='LOC-PICKER'
                />
                <div className="csftool-location-dialog"></div>
            </div>
        );
    }
}

export default App;
