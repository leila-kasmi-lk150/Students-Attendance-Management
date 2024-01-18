import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DataTable } from 'react-native-paper';
import { colors } from '../component/Constant';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

const Presence = ({ route, navigation }: { route: any, navigation: any }) => {
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const { session_id } = route.params;
  interface StudentItem {
    student_id: string;
    student_firstName: string;
    student_lastName: string;
    class_id: number;
    group_id: number;
  }
  const [studentList, setStudentList] = useState<StudentItem[]>([]);

  // later, delete this code (useEffect) when you work on database
  // when you fill studentList from there
  // delete just useEffect, because you need studentList and setStudentList variables ⚠
  useEffect(() => {
    const initialStudentList: StudentItem[] = [
      {
        student_id: '1',
        student_firstName: 'Leila',
        student_lastName: 'Kasmi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '2',
        student_firstName: 'Chourrouk',
        student_lastName: 'Saadi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '3',
        student_firstName: 'Ikram',
        student_lastName: 'Batouche',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '4',
        student_firstName: 'Nafissa',
        student_lastName: 'Belaroug',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '1',
        student_firstName: 'Leila',
        student_lastName: 'Kasmi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '2',
        student_firstName: 'Chourrouk',
        student_lastName: 'Saadi',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '3',
        student_firstName: 'Ikram',
        student_lastName: 'Batouche',
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: '4',
        student_firstName: 'Nafissa',
        student_lastName: 'Belaroug',
        class_id: 6,
        group_id: 9,
      },
    ];
    setStudentList(initialStudentList);
  }, []);

  const checkAttendance = false;
  // this variable checkAttendance for achieve if prof check Attendance or no 
  // whene you create your table_session you should put checkAttendance= false as defalt
  // then select checkAttendance from table_session and put the result in our const checkAttendance
  // I make it false as some time true , becuase I didn't use backend 
  // if checkAttendance=false, the first thing will display to prof whene he navigate from Session screen to pressen
  // is check Attendance section (pour fiare l'appel ) 
  // else statistic section will display, that men he check attendance 

  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
      id: '1', // Present
      label: 'P',
      value: 'P'
    },
    {
      id: '2', //absent
      label: 'Ab',
      value: 'Ab'
    }
  ]), []);

  const [selectedId, setSelectedId] = useState<string | undefined>();
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate('Group',
            { class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>{class_name} {group_name} {group_type}</Text>
      </View>
      {checkAttendance ? (
        // checkAttendance = true
        <Text style={{ color: 'red' }}>You check Attendance</Text>
      ) :
        // checkAttendance= false


        <View style={{ marginTop: 22, flex: 1 }}>

          <Text style={{ fontSize: 22, fontWeight: 'bold', }}>Check Attendance</Text>
          <View style={{ flex: 1 }}>
            <FlatList data={studentList} renderItem={({ item }) =>
              <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: 'center', }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 30,
                    paddingBottom: 30,
                  }}
                >
                  <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName}</Text>

                  <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                    layout='row'
                  />

                </TouchableOpacity>
              </View>
            } />
          </View>
        </View>
      }
    </SafeAreaView>
  )
}

export default Presence

const styles = StyleSheet.create({})