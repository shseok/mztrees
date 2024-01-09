import React, { Suspense } from 'react';
import styles from '@/styles/Notice.module.scss';
import BasicLayout from '@/components/layout/BasicLayout';
import Loading from '@/components/system/PostLoading';
import { Discord, Github, Gmail, Logo } from '@/components/vectors';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공지사항',
  description: 'Mztrees 공지사항',
  robots: 'noindex',
};

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
                싶다면 아래 <span>아이콘</span>을 클릭하여 요청해주세요.
              </li>
              <li>
                &bull; 프로젝트에 참여하고 싶으신 경우 <span>Gmail</span> 혹은{' '}
                <span>Github Discussions</span>을 통해 언제든지 기여해주시면
                감사하겠습니다. 여러분의 모든 아이디어를 환영합니다.
              </li>
            </ul>
            <ul className={styles.iconWrapper}>
              <li>
                <Link href='mailto:shseok0674@gmail.com'>
                  <Gmail />
                </Link>
              </li>
              <li>
                <Link
                  href='https://github.com/shseok/mztrees/issues'
                  target='_blank'
                >
                  <Github />
                </Link>
              </li>
              <li>
                <Link href='https://discord.gg/x64HebAK' target='_blank'>
                  <Discord />
                </Link>
              </li>
            </ul>
            <p className={styles.bottom}>대표 이메일: shseok0674@gmail.com</p>
          </section>
        </article>
      </Suspense>
    </BasicLayout>
  );
}
