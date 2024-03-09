import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react'
import ErrorGif from '../assets/error.gif'
import SuccessGif from '../assets/done.gif'
import InfoGif from '../assets/info.gif'

function Popup({ title, msg, isOpen, onClose, children }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody margin="auto" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <img src={title == "Success" ? SuccessGif : title == "Error" ? ErrorGif : InfoGif}
            alt=''
            style={{ height: "100px", width: "100px", margin: "auto" }} />
            <Text textAlign="center">{msg}</Text>

            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Popup