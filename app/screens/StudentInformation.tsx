import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../component/Constant';
import * as Sqlite from 'expo-sqlite';
import { DataTable, RadioButton, } from "react-native-paper";
import moment from 'moment';


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
    interface PresenceItem {
        comment: string | null;
        state: string;
        student_id: number;
        session_id: number;
        student_firstName: string;
        student_lastName: string;
        class_id: number;
        group_id: number;
        session_date: Date;
        session_time: string;
    }
    const [presenceList, setPresenceList] = useState<PresenceItem[]>([]);
    const fetchPresence = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT TP.comment, TP.state, TS.session_date, TS.session_id, TS.session_time FROM table_session TS LEFT JOIN table_presence TP ON TS.session_id = TP.session_id WHERE TP.student_id=?',
                [student_id],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setPresenceList(temp);
                }
            );
        });
    };
    const [abCount, setAbCount] = useState(0);
    const [pCount, setPCount] = useState(0);
    const [jaCount, setJaCount] = useState(0);

    const fetchStatistic = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT COUNT(state) as count FROM table_presence WHERE student_id=? AND state=?',
                [student_id, 'P'],
                (tx, results) => {
                    setPCount(results.rows.item(0).count);
                }
            );
            tx.executeSql(
                'SELECT COUNT(state) as count FROM table_presence WHERE student_id=? AND state=?',
                [student_id, 'Ab'],
                (tx, results) => {
                    setAbCount(results.rows.item(0).count);
                }
            );
            tx.executeSql(
                'SELECT COUNT(state) as count FROM table_presence WHERE student_id=? AND state=?',
                [student_id, 'JA'],
                (tx, results) => {
                    setJaCount(results.rows.item(0).count);
                }
            );
        });
    };


    useEffect(() => {
        fetchPresence();
        fetchStatistic();
    }, []);

    const [isModalPresenceVisible, setModalPresenceVisible] = useState(false);
    const toggleModalPresence = () => {
        setModalPresenceVisible(!isModalPresenceVisible);
    };
    const handleSavePresence = async () => {
        try {
            toggleModalPresence();
            await db.transaction(async (tx) => {
                await tx.executeSql(
                    'UPDATE table_presence SET state=?, comment=? WHERE student_id=? AND session_id=?',
                    [selectedStatus, editComment, student_id, editSessionId]
                );
            });
            fetchPresence();
            fetchStatistic();
            Alert.alert("Presence saved successfully!");
        } catch (error) {
            console.error(error);
            Alert.alert("Failed to save presence");
        }
    };

    var [selectedStatus, setSelectedStatus] = useState<string>('');
    var [editComment, setEditComment] = useState('');
    const [editSessionId, setEditSessionId] = useState('');
    const getDataEditingState = (item: any) => {
        setEditSessionId(item.session_id);
        setEditComment(item.comment);
    };


    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
            {/* header  */}
            <View style={{ flexDirection: 'row' }}>
                <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
                    onPress={() => navigation.navigate('MembreScreens',
                        { group_id: group_id, group_name: group_name, group_type: group_type, class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
                />
                <Text style={{ flex: 1, fontSize: 20, fontWeight: '700' }}>{student_lastName} {student_firstName}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Statistic</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
                        <Text style={{ color: colors.dark, fontSize: 18, }}
                            onPress={() => {
                            }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>P : </Text>{pCount}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
                        <Text style={{ color: colors.dark, fontSize: 18, }}
                            onPress={() => {
                            }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ab : </Text>{abCount}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.light, marginRight: 36, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, marginVertical: 16, }}>
                        <Text style={{ color: colors.dark, fontSize: 18, }}
                            onPress={() => {
                            }}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>JA : </Text>{jaCount}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {/* consult the attendance state per session (P, Ab, JA , C */}
                <View style={{ marginTop: 22, flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Attendance of Student</Text>
                    <View style={{ flex: 1 }}>
                        <FlatList data={presenceList} renderItem={({ item }) =>
                            <View style={{ backgroundColor: colors.light, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 7, borderRadius: 16, marginVertical: 16, alignItems: "center", }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalPresenceVisible(true);
                                        setSelectedStatus(item.state);
                                        getDataEditingState(item);
                                    }}
                                    style={{ flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 30, paddingBottom: 30, }}
                                >
                                    <Text style={{ fontWeight: '500', flex: 1 }}>{moment(item.session_date).format('ddd, MMM D YYYY')} - {moment(item.session_time, 'HH:mm:ss').format('HH:mm')}
                                        {'\n'}
                                        <Text style={{ fontWeight: '500', color: item.state === 'P' ? 'green' : item.state === 'Ab' ? 'red' : item.state === 'JA' ? 'orange' : 'black' }}>
                                            {item.state === 'P' ? 'Present' : item.state === 'Ab' ? 'Absent' : item.state === 'JA' ? 'Justified Absence' : 'Unknown State'}
                                        </Text>

                                        {'\n'}
                                        <Text style={{ color: colors.gray }}>{item.comment}</Text>

                                    </Text>
                                </TouchableOpacity>
                            </View>
                        } />
                    </View>
                    <Modal
                        isVisible={isModalPresenceVisible}
                        onBackdropPress={() => setModalPresenceVisible(false)}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Edit </Text>
                            <View>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: "600" }}>State:</Text>
                            </View>
                            <RadioButton.Group
                                onValueChange={(value) => setSelectedStatus(value)}
                                value={selectedStatus}>
                                <View style={{ flexDirection: "row" }}>
                                    <RadioButton.Item label="P" value="P" />
                                    <RadioButton.Item label="Ab" value="Ab" />
                                    <RadioButton.Item label="JA" value="JA" />
                                </View>
                            </RadioButton.Group>
                            <View>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: "600" }}> Comment: </Text>
                                <TextInput style={[styles.modalInput, { width: '100%' }]}
                                    placeholder='Enter Comment'
                                    value={editComment}
                                    onChangeText={(text) => setEditComment(text)}
                                />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100 }}>
                                <TouchableOpacity
                                    onPress={handleSavePresence}
                                    style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", margin: 3, left: 16 }}>
                                    <Text style={styles.buttonTexts}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={toggleModalPresence}
                                    style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", margin: 3, left: 16 }}>
                                    <Text style={styles.buttonTexts}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default StudentInformation

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 5,
    },
    buttonTexts: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    modalInput: {
        height: 40,
        borderColor: "gray",
        backgroundColor: "#fff",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    buttonEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        margin: 3,
        left: 16,
    },
})