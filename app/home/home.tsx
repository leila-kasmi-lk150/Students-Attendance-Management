import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const boxWidth = screenWidth * 0.8;

export default function home() {
  const currentDate = moment()
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, 'week').toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View
                style={[styles.itemRow, { paddingHorizontal: 16 }]}
                key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#111',
                            borderColor: '#111',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ flex: 1, alignItems: "center",justifyContent: "center", paddingHorizontal: 16, paddingVertical: 24, marginTop: 1 }}>
          <Text style={styles.subtitle}>{value.toDateString()}</Text>
          <View style={styles.placeholder}>
            <View style={styles.placeholderInset}>
            <View style={styles.row}>
                  <View style={[styles.box, { width: (screenWidth * 0.2), backgroundColor:'#FFD4D4' }]}><Text>{currentDate.format('HH:mm')}</Text></View>
                  <View style={[styles.box, { width: (screenWidth * 0.59), backgroundColor:'#FFD4D4', marginLeft:5 }]} ><Text>Maths ISI M1</Text></View>
              </View>
              <View style={styles.row}>
                  <View style={[styles.box, { width: (screenWidth * 0.2), backgroundColor:'#D4FFDF' }]}><Text>{currentDate.format('HH:mm')}</Text></View>
                  <View style={[styles.box, { width: (screenWidth * 0.59), backgroundColor:'#D4FFDF', marginLeft:5 }]}><Text>Managment ISI M1</Text></View>
              </View>
              <View style={styles.row}>
                  <View style={[styles.box, { width: (screenWidth * 0.2) }]}><Text>{currentDate.format('HH:mm')}</Text></View>
                  <View style={[styles.box, { width: (screenWidth * 0.59), marginLeft:5 }]}><Text>Algorithm INFO L1</Text></View>
              </View>
              <View style={styles.row}>
                  <View style={[styles.box, { width: (screenWidth * 0.2) }]}><Text>{currentDate.format('HH:mm')}</Text></View>
                  <View style={[styles.box, { width: (screenWidth * 0.59), marginLeft:5 }]}><Text>BDD WEB M1</Text></View>
              </View>
            </View>
          </View>
        </View>

        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  box1: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    margin: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  picker: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginTop: 37,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  item: {
    flex: 1,
    height: 75,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  box: {
    // flex: 1,
    height:63,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
    fontSize: 12,
    color: "#888",
    border: 100,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5
  },
});