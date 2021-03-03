import React, { useEffect, useRef, useState } from 'react';

import { CustomEditor } from 'rc-newsys';
import ErrorBoundary from './NotSupportErrorBoundary';
import { connect } from 'dva';
import { message } from 'antd';
import styles from './styles.less';
import { useThrottleFn } from '@/utils/hooks';

const SchemaDes = ({ onEdit, workItemDetail, curSchemaTemp, dispatch }) => {
  const [val, setVal] = useState([{ children: [{ type: 'subject', children: [{ text: '' }] }] }]);
  // ref缓存description解析后的缓存数据
  let { current } = useRef(null);

  const { description, subject } = workItemDetail;

  useEffect(() => {
    console.log('init', subject, current);

    if (!current) {
      // console.log(current);
      // setVal(current);
      setVal([{ children: [{ type: 'subject', children: [{ text: subject }] }] }]);
    }
  }, [current, subject]);

  useEffect(() => {
    parseNode();
  }, [description]);

  useEffect(() => {
    if (onEdit) {
      console.log('on', curSchemaTemp);
      curSchemaTemp && setVal(curSchemaTemp);
    } else {
      dispatch({ type: 'chitu_requireDetails/saveCurTemp', payload: undefined });
      if (current) {
        setVal(current);
      } else {
        setVal([{ children: [{ type: 'subject', children: [{ text: subject }] }] }]);
      }

      console.log('false');
    }
  }, [onEdit, curSchemaTemp]);

  //解析string为node
  async function parseNode() {
    if (description?.length > 5000) {
      await message.info('文档较大，正在处理...');
      message.destroy();
      message.success('文档加载成功');
    }
    const node = await JSON.parse(description);
    if (typeof node !== 'string') {
      console.log(current, node);

      current = node;
      if (!node) return;
      setVal(node);
    } else {
      message.error('文档解析错误');
    }
  }

  const desInfoChange = useThrottleFn((val) => {
    const curSubject = val.find((i, index) => i.type === 'subject' || index === 0);

    dispatch({
      type: 'chitu_requireDetails/changeFields',
      payload: { subject: curSubject.children[0]?.text, description: val },
    });
  }, 600);

  function handleSchemaVal(val) {
    setVal(val);
    desInfoChange(val);
  }

  //保证value中为node对象，只在初始化和存储时序列化和反序列化可以提升性能
  return (
    <ErrorBoundary>
      <div className={styles.schema}>
        <CustomEditor value={val} onChange={handleSchemaVal} readOnly={!onEdit} />
      </div>
    </ErrorBoundary>
  );
};

export default connect(({ chitu_requireDetails: { onEdit, workItemDetail, curSchemaTemp } }) => ({
  onEdit,
  workItemDetail,
  curSchemaTemp,
}))(SchemaDes);
