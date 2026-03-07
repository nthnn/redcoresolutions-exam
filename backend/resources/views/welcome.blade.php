<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Red Core Solutions - Backend</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: 'hsl(240 10% 3.9%)',
                        foreground: 'hsl(0 0% 98%)',
                        card: 'hsl(240 10% 3.9%)',
                        'card-foreground': 'hsl(0 0% 98%)',
                        popover: 'hsl(240 10% 3.9%)',
                        'popover-foreground': 'hsl(0 0% 98%)',
                        primary: 'hsl(0 0% 98%)',
                        'primary-foreground': 'hsl(240 5.9% 10%)',
                        secondary: 'hsl(240 3.7% 15.9%)',
                        'secondary-foreground': 'hsl(0 0% 98%)',
                        muted: 'hsl(240 3.7% 15.9%)',
                        'muted-foreground': 'hsl(240 5% 64.9%)',
                        accent: 'hsl(240 3.7% 15.9%)',
                        'accent-foreground': 'hsl(0 0% 98%)',
                        destructive: 'hsl(0 62.8% 30.6%)',
                        'destructive-foreground': 'hsl(0 0% 98%)',
                        border: 'hsl(240 3.7% 15.9%)',
                        input: 'hsl(240 3.7% 15.9%)',
                        ring: 'hsl(240 4.9% 83.9%)',
                    },
                    borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)',
                    },
                }
            }
        }
    </script>
    <style>
        :root {
            --radius: 0.5rem;
        }
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
    </style>
</head>
<body class="bg-background text-foreground min-h-screen flex items-center justify-center p-4">
    <div class="rounded-xl border border-border bg-card text-card-foreground shadow w-full max-w-lg mx-auto">
        <div class="flex flex-col space-y-1.5 p-6 text-center">
            <h3 class="font-semibold leading-none tracking-tight text-2xl text-foreground">Red Core Solutions</h3>
            <p class="text-sm text-muted-foreground pt-2">Coding Exam Backend</p>
        </div>
    </div>
</body>
</html>
