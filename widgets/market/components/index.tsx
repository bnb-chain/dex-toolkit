import { Current } from './Current';
import { Change } from './Change';

import { Container } from './styled';

export const Main = () => {
  return (
    <Container>
      <Current />
      <Change />
    </Container>
  );
};
