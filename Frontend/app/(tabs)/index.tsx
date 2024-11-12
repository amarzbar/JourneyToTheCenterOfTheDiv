import { Image, StyleSheet, Platform } from 'react-native';
import { View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
 <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
 <View style={{ flexDirection: "column", paddingHorizontal: 32, paddingVertical: 32 }}>
          {/* First Row Element Bus + Time */}
          <Text style={{ fontSize: 32 }}>
            Good Morning
          </Text>
        </View>


      <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center" , marginVertical:32}}>
        <View style={{ paddingHorizontal: 32, display:"flex" }}>
          <View style={{ paddingVertical: 24, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 24 }}>
              Departure Timing
            </Text>
            <Text style={{ fontSize: 24 }}>
              5:50PM
            </Text>
          </View>

          <View style={{ paddingVertical: 24, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 24 }}>
              Departure Timing
            </Text>
            <Text style={{ fontSize: 24 }}>
              5:50PM
            </Text>
          </View>

          <View style={{ paddingVertical: 24, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 24 }}>
              Departure Timing
            </Text>
            <Text style={{ fontSize: 24 }}>
              5:50PM
            </Text>
          </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
