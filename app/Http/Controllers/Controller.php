<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    /**
     * Garante que os dados JSON são parseados corretamente
     */
    protected function parseJsonInput(Request $request)
    {
        $data = $request->all();
        
        if (empty($data)) {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true) ?? [];
            $request->merge($data);
        }
        
        return $request;
    }
}
