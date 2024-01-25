import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../component/Constant';
import * as Sqlite from 'expo-sqlite';
import { DataTable, RadioButton, } from "react-native-paper";


const StudentInformation = ({ route, navigation }: { route: any, navigation: any }) => {
    let db = Sqlite.openDatabase('Leiknach.db');
    const { class_id } = route.params;
    const { class_name } = route.params;
    const { class_speciality } = route.params;
    const { class_level } = route.params;
    const { group_id } = route.params;
    const { group_name } = route.params;
    const { group_type } = route.params;
    const { student_id } = route.params;
    const { student_lastName } = route.params;
    const { student_firstName } = route.params;
    interface StudentItem {
        student_id: string;
        student_firstName: string;
        student_lastName: string;
        class_id: number;
        group_id: number;
    }
    const [studentList, setStudentList] = useState<StudentItem[]>([]);
    const [selectedStatusMap, setSelectedStatusMap] = useState<Record<string, string>>({}); // Map to store selectedStatus for each student
    const [commentMap, setCommentMap] = useState<Record<string, string>>({}); // Map to store comments for each student

    const handleRadioButtonChange = (studentId: string, value: string) => {
        setSelectedStatusMap((prevMap) => ({
            ...prevMap,
            [studentId]: value,
        }));
    };

    const renderStudentItem = ({ item }: { item: StudentItem }) => {
        if ('student_id' in item) {
            return (
                <View style={{ backgroundColor: colors.light, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16 }}>
                    <View style={{ flex: 1, padding: 15 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>{item.student_lastName} {item.student_firstName}</Text>
                        <RadioButton.Group
                            onValueChange={(value) => handleRadioButtonChange(item.student_id, value)}
                            // value={selectedStatusMap[item.student_id]}
                            value={selectedStatusMap[item.student_id] || 'P'}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Item label="P" value="P" />
                                <RadioButton.Item label="Ab" value="Ab" />
                            </View>
                        </RadioButton.Group>
                        <TextInput
                            style={{ height: 40, borderColor: "gray", backgroundColor: "#fff", borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, borderRadius: 10, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, }}
                            placeholder="Enter Comment ..."
                            value={commentMap[item.student_id] || ''}
                            onChangeText={(text) => handleCommentChange(item.student_id, text)}
                        />
                    </View>
                </View>
            );
        }
    };
    const handleCommentChange = (studentId: string, text: string) => {
        setCommentMap((prevMap) => ({
            ...prevMap,
            [studentId]: text,
        }));
    };
    const fetchStusent = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM table_presence tp , table_session ts WHERE tp.student_id=? ',
            [student_id],
            (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setStudentList(temp);
            }
          );
        });
      }
      useEffect(() => {
        fetchStusent();
      }, []);
    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
            {/* header  */}
            <View style={{ flexDirection: 'row' }}>
                <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
                    onPress={() => navigation.navigate('Group',
                        { group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
                />
                <Text style={{ flex: 1, fontSize: 20, fontWeight: '700' }}>{student_lastName} {student_firstName}</Text>
            </View>
            <View style={{ flex: 1, }}>
                {/* header  */}
                <View style={{ flexDirection: "row" }}>
                    <Ionicons
                        name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
                        onPress={() => navigation.navigate('SessionScreens', { group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
                    />
                    <Text style={{ flex: 1, fontSize: 25, fontWeight: "700" }}> {class_name} {group_name} {group_type}</Text>
                </View>
                <View style={{ marginTop: 22, flex: 1, }}>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}> Check Attendance </Text>
                    <FlatList
                        data={[...studentList, { id: 'saveButton' }]}
                        renderItem={renderStudentItem}
                        keyExtractor={(item, index) => ('student_id' in item) ? item.student_id : item.id}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default StudentInformation

const styles = StyleSheet.create({})