import { swalConfirm } from '../../utils/swal';
import Button from './Button';

/**
 * Badalka $('.confirm') – batoonka marka la riixo wuxuu soo bixinayaa Sweet Alert confirm.
 * Haddii isticmaale uu ansaxo, onConfirm ayaa la bixinayaa.
 */
export default function ConfirmButton({
  title = 'Ma hubtaa inaad tirtid?',
  text = '',
  confirmText = 'Haa, tirtir',
  cancelText = 'Maya',
  onConfirm,
  children,
  variant = 'danger',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const handleClick = async (e) => {
    e?.preventDefault?.();
    const confirmed = await swalConfirm({ title, text, confirmText, cancelText });
    if (confirmed && onConfirm) onConfirm(e);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}
