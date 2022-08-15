import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VoidFunctionComponent } from 'react';

export const IconCol: VoidFunctionComponent<{ i: number; className: string }> = ({ i, className }) => {
  let content: JSX.Element | null;
  const rowspan = i >= 6 ? undefined : 2;
  switch (i) {
    case 0:
      content = <FontAwesomeIcon icon="calendar" size="2x" />;
      break;
    case 2:
      content = <FontAwesomeIcon icon="clock" size="2x" />;
      break;
    case 4:
      content = (
        <span className="fa-stack fa-1x">
          <FontAwesomeIcon icon={['far', 'calendar']} className="fa-stack-2x" />
          <FontAwesomeIcon icon="clock" className="fa-stack-1x" transform={{ y: 4.5 }} />
        </span>
      );
      break;
    case 6:
      content = <FontAwesomeIcon icon="user-clock" size="2x" />;
      break;
    case 7:
      content = <FontAwesomeIcon icon="code" size="2x" />;
      break;
    default:
      content = null;
  }

  if (!content) return content;

  return (
    <td rowSpan={rowspan} className={`${className} d-none d-md-table-cell`}>
      {content}
    </td>
  );
};
