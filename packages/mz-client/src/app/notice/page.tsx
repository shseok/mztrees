import React, { Suspense } from 'react';
import styles from '@/styles/Notice.module.scss';
import BasicLayout from '@/components/layout/BasicLayout';
import Loading from '@/components/system/PostLoading';
import { Github, Gmail, Logo } from '@/components/vectors';
import Link from 'next/link';

export default function Notice() {
  return (
    <BasicLayout
      hasBackButton={true}
      title='공지사항'
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>
        <article className={styles.block}>
          <section className={styles.link_container}>
            <a
              className={styles.home_link}
              href='/'
              aria-label='로고를 통해 홈으로 이동'
            >
              <Logo className={styles.styled_logo} />
            </a>
          </section>
          <section className={styles.content}>
            <h1 className={styles.title}>공지사항</h1>
            <ul className={styles.body}>
              <li>
                &bull; 서비스 이용 중 <span>불편한 점</span>이나{' '}
                <span>버그를 발견</span>
                하신 경우, 신고해 주시면 검토 후 신속하게 답변해 드리겠습니다.
              </li>
              <li>
                &bull; 원하는 게시물에 태그가 없고, <span>태그를 추가</span>하고
                싶다면 아래 아이콘을 클릭하여 요청해주세요.
              </li>
              <li>
                &bull; 또한, 프로젝트에 기여를 원하신다면 <span>Gmail</span>{' '}
                혹은 <span>Github Discussions</span>을 이용해주세요.
              </li>
            </ul>
            <div className={styles.iconWrapper}>
              <Link href='mailto:shseok0674@gmail.com'>
                <Gmail />
              </Link>
              <Link
                href='https://github.com/shseok/mztrees/issues'
                target='_blank'
              >
                <Github />
              </Link>
            </div>
          </section>
        </article>
      </Suspense>
    </BasicLayout>
  );
}
