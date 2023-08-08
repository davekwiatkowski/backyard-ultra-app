import { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Button, Form } from 'antd';

const SubmitButton = ({ form, text }: { form: FormInstance; text: string }) => {
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  return (
    <Button type='primary' htmlType='submit' disabled={!submittable}>
      {text}
    </Button>
  );
};

export default SubmitButton;
