import { fontSizes } from '@/ui/theme/font';

import { Image } from '../Image';
import { Row } from '../Row';
import { Text } from '../Text';

export function Logo(props: { preset?: 'large' | 'small' }) {
  const { preset } = props;
  if (preset === 'large') {
    return (
      <Row justifyCenter itemsCenter>
        <Image src="./images/logo/wallet-logo.png" size={fontSizes.xxxl} />

        <Text text="UNIVERSAL" preset="title-bold" size="xxl" disableTranslate
          style={{ background: 'linear-gradient(90deg, #00e5ff, #b47aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Row>
    );
  } else {
    return (
      <Row justifyCenter itemsCenter>
        <Image src="./images/logo/wallet-logo.png" size={fontSizes.xxl} />
        <Text text="UNIVERSAL" preset="title-bold" disableTranslate
          style={{ background: 'linear-gradient(90deg, #00e5ff, #b47aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Row>
    );
  }
}
