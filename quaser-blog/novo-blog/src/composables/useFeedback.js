import { useQuasar } from 'quasar'

export default function useFeedback () {
  const $q = useQuasar()

  /**
   * Mostra uma notificação de sucesso.
   * @param {string} message - A mensagem a ser exibida.
   */
  const notifySuccess = (message) => {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message
    })
  }

  /**
   * Mostra uma notificação de erro.
   * @param {string} message - A mensagem de erro a ser exibida.
   */
  const notifyError = (message = 'Ocorreu uma falha. Tente novamente.') => {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message
    })
  }

  /**
   * Mostra um diálogo de confirmação.
   * @param {string} title - O título do diálogo.
   * @param {string} message - A mensagem de confirmação.
   * @returns {Promise} Uma promessa que é resolvida se o usuário clicar em OK.
   */
  const confirm = (title, message) => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        cancel: {
          label: 'Cancelar',
          flat: true
        },
        ok: {
          label: 'Confirmar',
          color: 'primary',
          flat: false
        },
        persistent: true
      }).onOk(() => {
        resolve(true)
      }).onCancel(() => {
        // Opcional: pode-se tratar o cancelamento se necessário
        // reject(new Error('Ação cancelada pelo usuário'));
      })
    })
  }

  return {
    notifySuccess,
    notifyError,
    confirm
  }
}