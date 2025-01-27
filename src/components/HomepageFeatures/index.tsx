import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [];

/* Keeping this commented out for future reference:
const originalFeatureList: FeatureItem[] = [
  {
    title: 'Imagine a wiki page link here',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed aliquam erat, in semper neque. Vestibulum suscipit tempus rhoncus. Aliquam in eleifend neque, viverra maximus nunc.
      </>
    ),
    link: '/docs/what-is-kigurumi',
  },
  {
    title: 'Something else about getting started',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Proin ut sem venenatis, vestibulum lacus nec, euismod libero. Pellentesque id ex eget libero facilisis malesuada.
      </>
    ),
    link: '/docs/what-is-kigurumi',
  },
  {
    title: 'What about a third topic to showcase?',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Duis rutrum fringilla ante. Vestibulum consectetur faucibus vestibulum.
      </>
    ),
    link: '/docs/what-is-kigurumi',
  },
];
*/

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <a href={link} className={styles.featureLink}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
