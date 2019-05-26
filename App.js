import React from 'react';

import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text
} from 'react-native';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';

export default class App extends React.PureComponent {

  mounted = false;
  state = {
    myPosition: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    mapType: 'standard'
  };

  componentDidMount() {
    mounted = true;
    // If you supply a coordinate prop, we won't try to track location automatically
    if (this.props.coordinate) {
      return;
    }

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        if (granted && mounted) {
          this.watchLocation();
        }
      });
    } else {
      this.watchLocation();
    }
  }

  toggleMapType () {
    this.setState({ mapType: this.state.mapType == 'standard' ? 'satellite' : 'standard' })
  }
  watchLocation() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const myLastPosition = this.state.myPosition;
        const myPosition = position.coords;
        if (!isEqual(myPosition, myLastPosition)) {
          this.setState({ myPosition });
        }
      },
      null,
      this.props.geolocationOptions
    );
  }
  render() {
    let { heading, coordinate } = this.props;
    if (!coordinate) {
      const { myPosition } = this.state;
      if (!myPosition) {
        return null;
      }
      coordinate = myPosition;
      heading = myPosition.heading;
    }

    return (
      <View style={styles.flex}>
        <MapView
          ref={el => (this.map = el)}
          style={styles.flex}
          minZoomLevel={15}
          mapType={this.state.mapType}
          initialRegion={{
            ...coordinate,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
          showsUserLocation
        >
        </MapView>
        <TouchableOpacity style={styles.button} onPress={() => this.toggleMapType()}>
          <Text>Trocar Tipo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(100,100,100,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: 50,
    width: '100%',
  },
});
