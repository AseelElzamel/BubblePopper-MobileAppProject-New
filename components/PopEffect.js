import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';

export default function PopEffect({x,y}){
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scale, {
                toValue: 2,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);
    
    return (
        <Animated.View
            style={[
                styles.pop,
                {
                    left: x,
                    top: y,
                    transform: [{scale}],
                    opacity,
                }
            ]}
        />
    );
}

const styles = StyleSheet.create({
    pop: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
});