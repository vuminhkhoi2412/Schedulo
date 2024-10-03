/* eslint-disable react-native/no-inline-styles */
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TaskAdditionComponent from '../../components/home/TaskAdditionComponent';
import {centerAll, vh, vw} from '../../services/styleSheet';
import {datePickerIcon} from '../../assets/svgXML';
import dayjs from 'dayjs';
import DateTimePicker from 'react-native-ui-datepicker';
import {challengeInputProps, ChallengeItem} from '../../services/typeProps';
import useStatusBar from '../../services/useStatusBarCustom';
import {
  generateChallengeData,
  TaskReminderRadio,
} from '../../services/renderData';
import {loadData, saveData} from '../../services/storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ChallengeAddition = () => {
  useStatusBar('#1940B6');
  const [challengeData, setChallengeData] = useState({
    title: '',
    aim: '',
    date: new Date(),
    reminder: '',
  });

  return (
    <TaskAdditionComponent
      title="Thử thách"
      subInput={
        <SubInput
          challengeData={challengeData}
          setChallengeData={setChallengeData}
        />
      }>
      <View>
        <MainInput
          challengeData={challengeData}
          setChallengeData={setChallengeData}
        />
      </View>
    </TaskAdditionComponent>
  );
};

const SubInputItemGroup: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({children, title}) => {
  return (
    <View style={{paddingHorizontal: vw(5)}}>
      <Text style={{color: '#363851', fontSize: 16, fontWeight: '700'}}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const SubInput: React.FC<challengeInputProps> = ({
  challengeData,
  setChallengeData,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [tmpStorage, setTmpStorage] = useState<ChallengeItem[][]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchData = async () => {
    try {
      const loadDataChallenge = await loadData<ChallengeItem[][]>(
        'ChallengeStorage',
      );
      setTmpStorage(loadDataChallenge);
    } catch (error) {
      saveData('ChallengeStorage', generateChallengeData());
      setTmpStorage(generateChallengeData());
    }
  };

  fetchData();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Check if all fields are filled
    const allFieldsFilled = Object.values(challengeData).every(
      value => value !== '',
    );
    setIsButtonDisabled(!allFieldsFilled);
  }, [challengeData]);

  const getDayOfWeekIndex = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6 and shift other days by 1
  };

  const handleAdd = () => {
    const dayIndex = getDayOfWeekIndex(challengeData.date);

    // Create a copy of the existing tmpStorage array
    const updatedTmpStorage = [...tmpStorage];

    // Ensure the dayIndex array exists
    if (!updatedTmpStorage[dayIndex]) {
      updatedTmpStorage[dayIndex] = [];
    }

    // Remove items with empty title
    updatedTmpStorage[dayIndex] = updatedTmpStorage[dayIndex].filter(
      item => item.title !== '',
    );

    // Push the new challengeData into the specific dayIndex array
    updatedTmpStorage[dayIndex] = [
      ...updatedTmpStorage[dayIndex],
      challengeData,
    ];

    // Update the state with the new array
    setTmpStorage(updatedTmpStorage);

    // Save the updated array to storage
    saveData('ChallengeStorage', updatedTmpStorage);

    // // Navigate to the main screen
    navigation.navigate('Main');
  };

  return (
    <View style={{flexGrow: 1, paddingVertical: vh(2)}}>
      <SubInputItemGroup title="Nhắc nhở">
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            flexWrap: 'wrap',
            marginTop: vh(2),
            justifyContent: 'space-between',
            rowGap: vh(2),
          }}>
          {TaskReminderRadio.map((item, index) => {
            const isSelected = challengeData.reminder === item;
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setChallengeData({...challengeData, reminder: item})
                }
                style={[
                  {
                    width: '23%',
                    borderRadius: 6,
                    paddingVertical: vh(1),
                    backgroundColor: isSelected ? '#1940B6' : '#EEF1FE',
                  },
                  centerAll,
                ]}>
                <Text
                  style={isSelected ? {color: 'white'} : {color: '#757575'}}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SubInputItemGroup>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: vh(2),
        }}>
        <View style={{width: vw(70)}}>
          <TouchableOpacity
            onPress={handleAdd}
            style={{
              backgroundColor: isButtonDisabled ? '#D3D3D3' : '#1940B6',
              width: '100%',
              paddingVertical: vh(1.5),
              borderRadius: 10,
            }}
            disabled={isButtonDisabled}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>
              Cập nhật
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const TextInputGroup: React.FC<{
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}> = ({placeholder, title, value, onChangeText}) => {
  return (
    <View>
      <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '700'}}>
        {title}
      </Text>
      <TextInput
        style={{
          borderBottomColor: '#D2D2D2',
          borderBottomWidth: 1,
          borderColor: '#D2D2D2',
        }}
        placeholder={placeholder}
        placeholderTextColor={'#FFFFFF4D'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const MainInput: React.FC<challengeInputProps> = ({
  challengeData,
  setChallengeData,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={{paddingHorizontal: vw(5), rowGap: vh(2)}}>
      <TextInputGroup
        placeholder="Điền tiêu đề"
        title="Tiêu đề"
        value={challengeData.title}
        onChangeText={text => setChallengeData({...challengeData, title: text})}
      />
      <TextInputGroup
        placeholder="Điền mục tiêu"
        title="Mục tiêu"
        value={challengeData.aim}
        onChangeText={text => setChallengeData({...challengeData, aim: text})}
      />
      <View>
        <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '700'}}>
          Chọn ngày
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            editable={false}
            style={{
              flex: 1,
              borderBottomColor: '#D2D2D2',
              borderBottomWidth: 1,
              borderColor: '#D2D2D2',
              color: '#FFFFFF',
            }}
            value={dayjs(challengeData.date).format('dddd, DD - MM - YYYY')}
            placeholder={'Chọn 1 ngày'}
            placeholderTextColor={'#FFFFFF4D'}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(!showDatePicker)}
            style={{position: 'absolute', right: 0}}>
            {datePickerIcon(vw(7), vw(7))}
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={showDatePicker}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={[
                {
                  backgroundColor: 'white',
                  width: '100%',
                  paddingVertical: vh(1),
                },
                centerAll,
              ]}>
              <Text style={{color: '#1940B6', fontSize: 20, fontWeight: '700'}}>
                Chọn ngày
              </Text>
            </View>
            <DateTimePicker
              locale={'vi-VN'}
              timePicker={false}
              onChange={params => {
                const selectedDate = dayjs(params.date).startOf('day');
                setChallengeData({
                  ...challengeData,
                  date: selectedDate.toDate(),
                });
              }}
              firstDayOfWeek={1}
              mode="single"
              date={challengeData.date}
              todayTextStyle={{color: '#FFFFFF'}}
              todayContainerStyle={{
                backgroundColor: '#E0483C',
                borderColor: '#E0483C',
              }}
              minDate={dayjs().startOf('day').toDate()}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              style={[
                {
                  marginTop: vh(2),
                  width: '80%',
                  backgroundColor: 'white',
                  paddingVertical: vh(1),
                  borderRadius: 10,
                },
                centerAll,
              ]}>
              <Text style={{color: '#041725', fontSize: 16}}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChallengeAddition;

const styles = StyleSheet.create({
  container: {backgroundColor: 'transparent'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1940B6',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: vh(2),
    overflow: 'hidden',
  },
});
