import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Col, Row } from "reactstrap";

import Button from "../../common/Button";

const ConfirmationModal = ({ style, onOpen, onConfirm, onDeny, message, children }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  return (
    <>
      <div
        style={style}
        onClick={() => {
          setIsConfirmationModalOpen(true);
          onOpen && onOpen();
        }}
      >
        {children}
      </div>
      <Modal
        isOpen={isConfirmationModalOpen}
        centered
        toggle={() => {
          onDeny && onDeny();
          setIsConfirmationModalOpen(false);
        }}
      >
        <ModalHeader
          toggle={() => {
            onDeny && onDeny();
            setIsConfirmationModalOpen(false);
          }}
        >
          {message}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col className="text-center">
              <Button
                style={{ marginLeft: "5px" }}
                buttonStyle="btnStyle"
                onClick={() => {
                  onConfirm && onConfirm();
                  setIsConfirmationModalOpen(false);
                }}
              >
                Yes
              </Button>
              <Button
                style={{ marginLeft: "5px" }}
                buttonStyle="btnStyle"
                onClick={() => {
                  onDeny && onDeny();
                  setIsConfirmationModalOpen(false);
                }}
              >
                No
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ConfirmationModal;
