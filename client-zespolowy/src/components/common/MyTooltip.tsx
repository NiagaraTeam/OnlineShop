import { ReactNode } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/types';

interface Props {
    placement?: Placement; 
    text: string;
    children: ReactNode; 
  }

const MyTooltip = ({ placement, text, children }: Props) => {

    const tooltip = (text: string) => {
        return (
        <Tooltip>
            <strong>{text}</strong>
        </Tooltip>
        )
    };

  return (
    <OverlayTrigger placement={placement} overlay={tooltip(text)}>
      <span>
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default MyTooltip;