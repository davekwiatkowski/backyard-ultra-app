import { DatePicker, Form, Space, TimePicker, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useContext } from 'react';
import SubmitButton from './shared/SubmitButton';
import { useWatch } from 'rc-field-form';
import RaceState from '../constants/RaceState';
import RaceContext from '../store/RaceContext';

const { Item, useForm } = Form;
const { Text, Title } = Typography;

const RaceConfig = () => {
  const { setStartTime, setRaceState, startTime } = useContext(RaceContext);
  const [form] = useForm<{ date: Dayjs; time: Dayjs }>();
  const date = useWatch('date', form);

  const getDateTime = useCallback(
    (time: Dayjs) => {
      if (!date || !time) {
        return undefined;
      }
      let result = date;
      result = result.set('hour', time.hour());
      result = result.set('minute', time.minute());
      result = result.set('second', time.second());
      result = result.set('millisecond', time.millisecond());
      return result;
    },
    [date]
  );

  const handleFinish = useCallback(
    (values: any) => {
      const dateTime = getDateTime(values.time);
      if (dateTime) {
        setStartTime(dateTime);
        setRaceState(RaceState.Waiting);
        message.success('Race initialized.');
      }
    },
    [getDateTime, setRaceState, setStartTime]
  );

  return (
    <Form form={form} onFinish={handleFinish}>
      <div>
        <Title level={2}>Race setup</Title>
        <Text>
          To continue a previous race, apply a previous date or time. To start a
          new race, set a date or time in the future.
        </Text>
      </div>
      <br />
      <Item
        initialValue={startTime}
        label='Start date'
        name='date'
        rules={[
          { required: true },
          {
            warningOnly: true,
            validator: (_, value) => {
              if (value && value < dayjs(dayjs().format('YYYY-MM-DD'))) {
                return Promise.reject('Note: This is a previous day');
              }
              return Promise.resolve();
            },
          },
        ]}>
        <DatePicker inputReadOnly />
      </Item>
      <Item
        initialValue={startTime}
        label='Start time'
        name='time'
        rules={[
          { required: true },
          {
            warningOnly: true,
            validator: (_, value) => {
              const dateTime = getDateTime(value);
              if (!dateTime || !dateTime.isBefore(dayjs())) {
                return Promise.resolve();
              }
              return Promise.reject('Note: This is a previous time');
            },
          },
        ]}>
        <TimePicker
          inputReadOnly
          format='h:mm:ss a'
          use12Hours
          showNow={false}
        />
      </Item>
      <Item>
        <Space>
          <SubmitButton form={form} text={'Confirm'} />
        </Space>
      </Item>
    </Form>
  );
};

export default RaceConfig;
