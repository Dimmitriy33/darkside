using System.ComponentModel.DataAnnotations;

namespace darkside_backend.Helpers
{
    public class FormFileSizeAttribute : ValidationAttribute
    {
        private readonly int? _maxFileSize = null;
        private readonly int? _minFileSize = null;

        public FormFileSizeAttribute(int maxFileSize)
        {
            _maxFileSize = maxFileSize;
        }

        public FormFileSizeAttribute(int minFileSize, int maxFileSize)
        {
            _maxFileSize = maxFileSize;
            _minFileSize = minFileSize;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var isArray = value.GetType().IsArray;
            FormFile[] arr;
            ValidationResult result = null;

            if (isArray)
            {
                arr = (FormFile[])value;
            }
            else
            {
                arr = new[]
                {
                    (FormFile)value
                };
            }

            foreach (var file in arr)
            {
                if (result != null) continue;

                if (!_maxFileSize.HasValue || file.Length > _maxFileSize)
                {
                    result = new ValidationResult(GetErrorMessage(_maxFileSize));
                }

                if (!_minFileSize.HasValue || file.Length < _minFileSize)
                {
                    result = new ValidationResult(GetErrorMessage(_minFileSize));
                }
            }

            return (result ?? ValidationResult.Success)!;
        }

        private string GetErrorMessage(int? fileSize)
            => $"Maximum allowed file size is {fileSize} bytes.";
    }
}
