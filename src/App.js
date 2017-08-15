// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, ScrollView, Animated} from 'react-native';

import Photo from './Photo';
import SelectedPhoto from './SelectedPhoto';

import type {Measurement} from './Measurement-type';

let photos = ['1', '2', '3', '4', '5'];

type State = {
  selectedPhotoMeasurement?: Measurement;
  isDragging: boolean;
};

export default class App extends React.Component {
  state: State;
  _scrollValue: Animated.Value;
  _scaleValue: Animated.Value;
  _gesturePosition: Animated.ValueXY;

  constructor() {
    super(...arguments);

    this._scrollValue = new Animated.Value(0);
    this._scaleValue = new Animated.Value(1);
    this._gesturePosition = new Animated.ValueXY();
    this.state = {
      isDragging: false,
    };
  }

  static childContextTypes = {
    gesturePosition: PropTypes.object,
    scrollValue: PropTypes.object,
    scaleValue: PropTypes.object,
  };

  getChildContext() {
    return {
      gesturePosition: this._gesturePosition,
      scaleValue: this._scaleValue,
      scrollValue: this._scrollValue,
    };
  }

  render() {
    let {isDragging, selectedPhotoMeasurement} = this.state;
    let onScroll = Animated.event([
      {nativeEvent: {contentOffset: {y: this._scrollValue}}},
    ]);

    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll}
          scrollEnabled={!isDragging}
        >
          {photos.map((photo, key) => {
            return (
              <Photo
                photo={photo}
                key={key}
                onGestureStart={(measurement: Measurement) => {
                  this.setState({
                    selectedPhotoMeasurement: measurement,
                    isDragging: true,
                  });
                }}
                onGestureRelease={() => this.setState({isDragging: false})}
              />
            );
          })}
        </ScrollView>
        {selectedPhotoMeasurement
          ? <SelectedPhoto
            selectedPhotoMeasurement={selectedPhotoMeasurement}
            isDragging={isDragging}
          />
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});
