import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { DataTable, RadioButton } from "react-native-paper";
import { colors } from "../component/Constant";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import Modal from "react-native-modal";

const Presence = ({ route, navigation }: { route: any; navigation: any }) => {
  const screenWidth = Dimensions.get("window").width;
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const { session_id } = route.params;

  // Model for add new session
  const [isModalPresenceVisible, setModalPresenceVisible] = useState(false);
  // Toggle model for add new session
  const toggleModalPresence = () => {
    setModalPresenceVisible(!isModalPresenceVisible);
  };
  const handleSavePresence = async () => {
    // this alert just for test , replace with the name of function that add new session
    Alert.alert("Presence !! Just Test");
    toggleModalPresence();
  };

  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(
    null
  );
  const renderConsultAttendanc = ({ item }: { item: StudentItem }) => (
    <View
  style={{
    backgroundColor: colors.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    borderRadius: 16,
    marginVertical: 16,
    alignItems: "center",
  }}
>
  <TouchableOpacity
    onPress={() => {
      setSelectedStudent(item);
      setModalPresenceVisible(true);
    }}
    style={{
      flexDirection: "row",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 30,
      paddingBottom: 30,
    }}
  >
    <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName} 
      {'\n'}
      <Text style={{color: 'green'}}>Present</Text>
      {'\n'}
      <Text style={{color: colors.gray}}>
      Lorem ipsum, dolor sit amet consectetued cum explicabo qui assumenda.
      </Text>
      
    </Text>
  </TouchableOpacity>
</View>

  );
  const renderStudentItem = ({ item }: { item: StudentItem }) => (
    <View
  style={{
    backgroundColor: colors.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    borderRadius: 16,
    marginVertical: 16,
    alignItems: "center",
  }}
>
  <TouchableOpacity
    onPress={() => {
      setSelectedStudent(item);
      setModalPresenceVisible(true);
    }}
    style={{
      flexDirection: "row",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 30,
      paddingBottom: 30,
    }}
  >
    <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName} 
    </Text>
  </TouchableOpacity>
</View>

  );
  const [selectedStatus, setSelectedStatus] = useState("");
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
        student_id: "1",
        student_firstName: "Leila",
        student_lastName: "Kasmi",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "2",
        student_firstName: "Chourrouk",
        student_lastName: "Saadi",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "3",
        student_firstName: "Ikram",
        student_lastName: "Batouche",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "4",
        student_firstName: "Nafissa",
        student_lastName: "Belaroug",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "1",
        student_firstName: "Leila",
        student_lastName: "Kasmi",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "2",
        student_firstName: "Chourrouk",
        student_lastName: "Saadi",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "3",
        student_firstName: "Ikram",
        student_lastName: "Batouche",
        class_id: 6,
        group_id: 9,
      },
      {
        student_id: "4",
        student_firstName: "Nafissa",
        student_lastName: "Belaroug",
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

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          name="ios-arrow-back"
          size={25}
          color="#05BFDB"
          style={{ top: 10, marginRight: 15 }}
          onPress={() =>
            navigation.navigate("Group", {
              class_id: class_id,
              class_name: class_name,
              class_speciality: class_speciality,
              class_level: class_level,
            })
          }
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: "700" }}>
          {class_name} {group_name} {group_type}
        </Text>
      </View>
      {checkAttendance ? (
        // checkAttendance = true
        <View>
          {/* Search Section */}
          <View style={styles.viewSearch}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
            <TextInput
              style={{ paddingLeft: 8, fontSize: 16 }}
              placeholder="Search for Student..."
            />
          </View>

          {/* add pie chart  */}

          {/* consult the attendance state per session (P, Ab, JA , C */}
          <View style={{ marginTop: 22 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}> Consult Attendance</Text>
            <View >
              <FlatList
                data={studentList}
                renderItem={renderConsultAttendanc}
                keyExtractor={(item) => item.student_id.toString()}
              />
              {selectedStudent && (
                <Modal
                  isVisible={isModalPresenceVisible}
                  onBackdropPress={() => setModalPresenceVisible(false)}
                >
                  <View style={styles.modalContent}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      {selectedStudent.student_lastName}{" "}
                      {selectedStudent.student_firstName}
                    </Text>
                    <View>
                      <Text
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          fontWeight: "600",
                        }}
                      >
                        State:
                      </Text>
                    </View>
                    <RadioButton.Group
                      onValueChange={(value) => setSelectedStatus(value)}
                      value={selectedStatus}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <RadioButton.Item label="P" value="p" />
                        <RadioButton.Item label="Ab" value="ab" />
                        <RadioButton.Item label="JA" value="JA" />
                      </View>
                    </RadioButton.Group>
                    <View>
                      <Text
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          fontWeight: "600",
                        }}
                      >
                        Comment:
                      </Text>
                    </View>
                    <TextInput
                      style={[styles.modalInput, { width: "100%" }]}
                      placeholder="Enter comment"
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 100,
                      }}
                    >
                      <TouchableOpacity
                        onPress={handleSavePresence}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10,
                          alignItems: "center",
                          margin: 3,
                          left: 16,
                        }}
                      >
                        <Text style={styles.buttonTexts}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={toggleModalPresence}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10,
                          alignItems: "center",
                          margin: 3,
                          left: 16,
                        }}
                      >
                        <Text style={styles.buttonTexts}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        </View>
      ) : (
        // checkAttendance= false
        <View style={{ marginTop: 22, flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Check Attendance
          </Text>
          <View style={{ flex: 1 }}>
            <FlatList
              data={studentList}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.student_id.toString()}
            />
            {selectedStudent && (
              <Modal
                isVisible={isModalPresenceVisible}
                onBackdropPress={() => setModalPresenceVisible(false)}
              >
                <View style={styles.modalContent}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {selectedStudent.student_lastName}{" "}
                    {selectedStudent.student_firstName}
                  </Text>
                  <View>
                    <Text
                      style={{
                        marginTop: 5,
                        marginBottom: 5,
                        fontWeight: "600",
                      }}
                    >
                      State:
                    </Text>
                  </View>
                  <RadioButton.Group
                    onValueChange={(value) => setSelectedStatus(value)}
                    value={selectedStatus}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <RadioButton.Item label="Present" value="present" />
                      <RadioButton.Item label="Absent" value="absent" />
                    </View>
                  </RadioButton.Group>
                  <View>
                    <Text
                      style={{
                        marginTop: 5,
                        marginBottom: 5,
                        fontWeight: "600",
                      }}
                    >
                      Comment:
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.modalInput, { width: "100%" }]}
                    placeholder="Enter comment"
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: 100,
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleSavePresence}
                      style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: "center",
                        margin: 3,
                        left: 16,
                      }}
                    >
                      <Text style={styles.buttonTexts}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={toggleModalPresence}
                      style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: "center",
                        margin: 3,
                        left: 16,
                      }}
                    >
                      <Text style={styles.buttonTexts}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Presence;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 5,
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
    justifyContent: "center",
    alignItems: "center",
    // width: 200,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    margin: 15,
    width: ScreenWidth * 0.4,
  },
  buttonTexts: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  viewSearch: {
    backgroundColor: colors.light,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginVertical: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
});
