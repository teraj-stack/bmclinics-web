import 'dart:convert';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyOptimizedApp());
}

class MyOptimizedApp extends StatelessWidget {
  const MyOptimizedApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: OptimizedScreen(),
    );
  }
}

/// Musi być funkcją top-level albo static, aby mogła działać w isolate.
String generateAndParseHugeJson(int count) {
  final random = Random(42);

  final data = List.generate(
    count,
    (index) => <String, Object>{
      'id': index,
      'value': random.nextDouble(),
      'text': 'Element $index',
    },
    growable: false,
  );

  final jsonString = jsonEncode(data);
  final decoded = jsonDecode(jsonString) as List<dynamic>;

  return 'Sparowano obiektów: ${decoded.length}';
}

class OptimizedScreen extends StatefulWidget {
  const OptimizedScreen({super.key});

  @override
  State<OptimizedScreen> createState() => _OptimizedScreenState();
}

class _OptimizedScreenState extends State<OptimizedScreen> {
  static const int _itemCount = 10000;
  static const int _jsonObjectCount = 500000;

  int _counter = 0;
  late Future<String> _parseResult;

  @override
  void initState() {
    super.initState();
    _parseResult = _loadHeavyData();
  }

  Future<String> _loadHeavyData() {
    return compute(generateAndParseHugeJson, _jsonObjectCount);
  }

  void _reloadData() {
    setState(() {
      _parseResult = _loadHeavyData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Zoptymalizowany Flutter'),
        actions: [
          IconButton(
            onPressed: _reloadData,
            icon: const Icon(Icons.refresh),
            tooltip: 'Wczytaj dane ponownie',
          ),
        ],
      ),
      body: Column(
        children: [
          const SizedBox(height: 16),
          const Text(
            'Klikanie przycisku zmienia wyłącznie licznik.',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          FutureBuilder<String>(
            future: _parseResult,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return const Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 12),
                      Text('Przetwarzanie dużego JSON-a w tle...'),
                    ],
                  ),
                );
              }

              if (snapshot.hasError) {
                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text('Błąd: ${snapshot.error}'),
                );
              }

              return Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  snapshot.data ?? 'Brak danych',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              );
            },
          ),
          Text(
            'Licznik: $_counter',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: _itemCount,
              itemExtent: 56,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text('Element $index'),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() => _counter++),
        tooltip: 'Zwiększ licznik',
        child: const Icon(Icons.add),
      ),
    );
  }
}
