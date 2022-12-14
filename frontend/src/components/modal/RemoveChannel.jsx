import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import useSocket from '../../hooks/socket.js';
import { closeModal } from '../../slices/modalSlice.js';

const RemoveChannel = () => {
  const { removeChannel } = useSocket();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { modals } = useSelector((state) => state.modals);
  const { isShown, targetId } = modals;

  const handleClose = () => dispatch(closeModal());

  const handleRemove = (id) => {
    try {
      removeChannel(id);
      dispatch(closeModal());
      toast.success(t('success.removeChannel'));
    } catch (err) {
      toast.error(t('errors.channelRemove'));
    }
  };

  return (
    <Modal show={isShown} centered>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title>{t('modal.confirm')}</Modal.Title>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="danger" onClick={() => handleRemove(targetId)}>
            {t('modal.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
