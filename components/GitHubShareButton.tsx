import styles from './styles.module.css'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'

export function GitHubShareButton() {
  return (
    <a
      href="https://github.com/lilohoa/lilohoa"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.githubButton}
    >
      <FaGithub style={{ marginRight: '0.5rem' }} />
      Star on GitHub
    </a>
  )
}