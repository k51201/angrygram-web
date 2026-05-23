import { styled } from '@mui/material/styles'

export function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

export const ModalPaper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'absolute',
  width: 400,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}))